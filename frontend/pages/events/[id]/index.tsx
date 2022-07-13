import React from "react";
import { useAccount, useSigner, useProvider, useNetwork } from "wagmi";
import { BigNumber, ethers } from "ethers";
import MainLayout from "../../../layouts/Main";
import EventDetailTemplate from "../../../templates/EventDetail";
import { useRouter } from "next/router";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import {
    ZKTokenProof,
    ZKTokenProof__factory,
} from "../../../utilities/typechain";
import { ZK_TOKEN_PROOF_ADDRESS } from "../../../utilities/constants";
import { Event } from "../../../utilities/entities";
import { useSnackbar } from "notistack";
import { Buffer } from "buffer";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const {
    generateProof,
    packToSolidityProof,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("@semaphore-protocol/proof");

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPH_API_URL,
    cache: new InMemoryCache(),
});

/**
 * 0. retrieve event from _id.
 *    a. if event not found, redirect 404.
 *    b. if found, retrieve whole params from contract.
 * 1. retrieve events to build merkle tree
 * 2. if you have at least one appropriate NFT, you can register your identityCommitment by calling registrant contract's register function.
 * 3. if you submitted the event, wait until the relayers submit your identityCommitment to the ZKTokenProof contract.
 * 4. if your identity
 */
export default function EventDetail() {
    const router = useRouter();
    const { chain } = useNetwork();
    const { address: account } = useAccount();
    const { data: signer } = useSigner();
    const provider = useProvider();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = router.query;
    const [identityCommitment] = useLocalStorage("identityCommitment", "");
    const [contract, setContract] = React.useState<ZKTokenProof | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [event, setEvent] = React.useState<Event>({});
    const [identity, setIdentity] = React.useState<Identity | null>(null);
    const [solidityProof, setSolidityProof] = React.useState("");

    const eventGroup = React.useMemo(() => {
        return new Group();
    }, []);

    React.useEffect(() => {
        if (!identityCommitment || !account) {
            router.push("/");
        }
        if (signer) {
            const contract = ZKTokenProof__factory.connect(
                ZK_TOKEN_PROOF_ADDRESS,
                signer
            );
            setContract(contract);
        }
    }, [identityCommitment, provider, router, signer, account]);

    React.useEffect(() => {
        if (identityCommitment) {
            const identity = new Identity(identityCommitment);
            setIdentity(identity);
        }
    }, [identityCommitment]);

    React.useEffect(() => {
        if (contract && id && chain && chain.id === 137) {
            contract.events(id as string).then(r => {
                if (!r) return;
                setEvent({
                    adminAddress: r.adminAddress,
                    contractAddress: r.contractAddress,
                    title: r.title,
                    fee: r.fee,
                });
            });
        }
    }, [chain, contract, id]);

    // listen MemberAdded(groupId, identityCommitment, root)
    React.useEffect(() => {
        if (contract && identity && chain && chain.id === 137) {
            const groupId = BigNumber.from(id);
            const filter = contract.filters.MemberAdded(groupId, null, null);
            const eventQuery = `
            query {
              zkEvent(id: "${id}") {
                members
              }
            }`;

            client
                .query({
                    query: gql(eventQuery),
                })
                .then(queryResult => {
                    if (queryResult.data && queryResult.data.zkEvent) {
                        for (const member of queryResult.data.zkEvent.members) {
                            eventGroup.addMember(member);
                        }
                    }

                    contract.on(filter, (groupId, identityCommitment) => {
                        const memberIndex = eventGroup.indexOf(
                            identityCommitment.toString()
                        );
                        if (memberIndex === -1) {
                            eventGroup.addMember(identityCommitment.toString());
                            enqueueSnackbar(
                                "You are included in the members.",
                                {
                                    variant: "success",
                                }
                            );
                        }
                    });
                });
        }
        return () => {
            contract?.removeAllListeners();
        };
    }, [chain, contract, enqueueSnackbar, eventGroup, id, identity]);

    const onClickJoinEvent = React.useCallback(async () => {
        if (!identity || !signer || !chain || chain.id !== 137) return;
        const commitment = identity.generateCommitment();

        const memberIndex = eventGroup.indexOf(commitment);
        if (memberIndex !== -1) {
            enqueueSnackbar("You are already a member.", { variant: "error" });
            return;
        }
        setLoading(true);
        try {
            const address = await signer.getAddress();
            const response = await fetch("/api/events", {
                method: "POST",
                body: JSON.stringify({
                    eventId: id,
                    address,
                    identityCommitment: BigNumber.from(commitment).toString(),
                }),
            });

            if (response.status !== 200) {
                const errorMessage = await response.text();
                console.log(errorMessage);
                enqueueSnackbar(errorMessage, { variant: "error" });
            } else {
                enqueueSnackbar(
                    "Successfully joined! Wait until relayers execute your transaction.",
                    { variant: "success" }
                );
            }
        } catch (e) {
            console.log(e);
            enqueueSnackbar("Unknown error", { variant: "error" });
        }
        setLoading(false);
    }, [chain, enqueueSnackbar, eventGroup, id, identity, signer]);

    const onClickGenerateProof = React.useCallback(async () => {
        if (!identity) return;
        const commitment = identity.generateCommitment();
        const memberIndex = eventGroup.indexOf(commitment);
        if (memberIndex === -1) {
            enqueueSnackbar("You are not a member.", { variant: "error" });
            return;
        }
        setLoading(true);

        console.log(eventGroup.root);

        // TODO what would be appropriate to set below the variables.
        const externalNullifier = "1";
        const signal = "42";

        const proof = await generateProof(
            identity,
            eventGroup,
            externalNullifier,
            signal,
            {
                zkeyFilePath: "/semaphore.zkey",
                wasmFilePath: "/semaphore.wasm",
            }
        );
        const proofQR = Buffer.from(
            JSON.stringify({
                id,
                signal: ethers.utils.formatBytes32String(signal),
                nullifierHash: proof.publicSignals.nullifierHash,
                externalNullifier,
                proof: packToSolidityProof(proof.proof),
            })
        ).toString("base64");
        setSolidityProof(proofQR);
        setLoading(false);
        console.log(proofQR);
    }, [enqueueSnackbar, eventGroup, id, identity]);

    return (
        <MainLayout loading={loading} setLoading={setLoading} title={"event"}>
            <EventDetailTemplate
                event={event}
                onClickJoinEvent={onClickJoinEvent}
                onClickGenerateProof={onClickGenerateProof}
                solidityProof={solidityProof}
            />
        </MainLayout>
    );
}
