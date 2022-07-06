import React from "react";
import { useAccount, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import MainLayout from "../../../layouts/Main";
import EventDetailTemplate from "../../../templates/EventDetail";
import { useRouter } from "next/router";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { ZKTokenProof, ZKTokenProof__factory } from "../../../types/typechain";
import { ZK_TOKEN_PROOF_ADDRESS } from "../../../utilities/constants";
import { Event } from "../../../types/entities";
import { useSnackbar } from "notistack";
import { Buffer } from "buffer";

const {
    generateProof,
    packToSolidityProof,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("@semaphore-protocol/proof");

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
    const { data: account } = useAccount();
    const { data: signer } = useSigner();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = router.query;
    const [address, setAddress] = React.useState("");
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
        if (!identityCommitment || !account?.address) {
            router.push("/");
        }
        if (account?.address) {
            setAddress(account.address);
        } else {
            setAddress("");
        }
        if (signer) {
            const contract = ZKTokenProof__factory.connect(
                ZK_TOKEN_PROOF_ADDRESS,
                signer
            );
            setContract(contract);
        }
    }, [account, identityCommitment, router, signer]);

    React.useEffect(() => {
        if (identityCommitment) {
            const identity = new Identity(identityCommitment);
            setIdentity(identity);
        }
    }, [identityCommitment]);

    React.useEffect(() => {
        if (contract && id) {
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
    }, [contract, id]);

    // listen MemberAdded(groupId, identityCommitment, root)
    React.useEffect(() => {
        if (contract) {
            const groupId = BigNumber.from(id);
            const filters = [
                contract.filters.MemberAdded(groupId, null, null),
                contract.filters.MemberRemoved(groupId, null, null),
            ];

            contract.on(filters[0], (groupId, identityCommitment, root) => {
                eventGroup.addMember(identityCommitment.toString());
            });
            contract.on(filters[1], (groupId, identityCommitment, root) => {
                const index = eventGroup.indexOf(identityCommitment.toString());
                if (index !== -1) eventGroup.removeMember(index);
            });
        }
    }, [contract, eventGroup, id]);

    const onClickJoinEvent = React.useCallback(() => {
        if (!identity) return;
        const commitment = identity.generateCommitment();

        const memberIndex = eventGroup.indexOf(commitment);
        if (memberIndex !== -1) {
            enqueueSnackbar("You are already a member.", { variant: "error" });
            return;
        }
        try {
            // TODO call registant
        } catch (e) {}
    }, [enqueueSnackbar, eventGroup, identity]);

    const onClickGenerateProof = React.useCallback(async () => {
        if (!identity) return;
        const commitment = identity.generateCommitment();
        const memberIndex = eventGroup.indexOf(commitment);
        if (memberIndex === -1) {
            enqueueSnackbar("You are not a member.", { variant: "error" });
            return;
        }
        setLoading(true);

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
    }, [enqueueSnackbar, eventGroup, id, identity]);

    return (
        <MainLayout loading={loading} setLoading={setLoading}>
            <EventDetailTemplate
                adminAddress={address}
                event={event}
                onClickJoinEvent={onClickJoinEvent}
                onClickGenerateProof={onClickGenerateProof}
                solidityProof={solidityProof}
            />
        </MainLayout>
    );
}
