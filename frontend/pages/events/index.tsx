import React from "react";
import { useAccount, useSigner } from "wagmi";
import { utils, BigNumber } from "ethers";
import MainLayout from "../../layouts/Main";
import { useRouter } from "next/router";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import EventsTemplate from "../../templates/Events";

import { TForm } from "../../components/Form";
import { ZKTokenProof, ZKTokenProof__factory } from "../../types/typechain";
import { SNARK_LIMIT, ZK_TOKEN_PROOF_ADDRESS } from "../../utilities/constants";

export default function Events() {
    /**
     * 0. if not wallet connected, or no identityCommitment, redirect to top page
     * 1. create an event
     * 2. send a transaction to the ZKTokenProof contract
     * 3. await the transaction included to the block
     * 4. redirect to the event page
     */
    const router = useRouter();
    const { data: account } = useAccount();
    const { data: signer } = useSigner();
    const [address, setAddress] = React.useState("");
    const [identityCommitment] = useLocalStorage("identityCommitment", "");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [sDialogOpen, setSDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [contract, setContract] = React.useState<ZKTokenProof | null>(null);
    const [eventId, setEventId] = React.useState<string>("eventId");

    const handleClickDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleSDialogOpen = () => {
        setSDialogOpen(true);
    };

    const handleSDialogClose = () => {
        setSDialogOpen(false);
    };

    const handleSubmit = async (form: TForm) => {
        if (!contract) {
            return;
        }
        setLoading(true);

        try {
            const fee = await contract.fee();

            let id;
            while (id === undefined) {
                const candidate = BigNumber.from(utils.randomBytes(32));
                if (candidate.lt(SNARK_LIMIT)) {
                    id = candidate;
                    break;
                }
            }
            setEventId(id.toString());

            const tx = await contract.createEvent(
                id,
                20,
                0,
                form.contractAddress,
                form.title,
                utils.parseEther(form.feeInETH),
                {
                    value: fee,
                }
            );
            await tx.wait();
            handleDialogClose();
            setLoading(false);
            setSDialogOpen(true);
        } catch (e) {
            console.error(e);
        }
    };

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
            setContract(
                ZKTokenProof__factory.connect(ZK_TOKEN_PROOF_ADDRESS, signer)
            );
        }
    }, [account, identityCommitment, router, signer]);

    const onClickVerify = () => {
        router.push("/verify");
    };

    return (
        <MainLayout loading={loading} setLoading={setLoading}>
            <EventsTemplate
                eventId={eventId}
                handleSubmit={handleSubmit}
                adminAddress={address}
                dialogOpen={dialogOpen}
                sDialogOpen={sDialogOpen}
                handleClickDialogOpen={handleClickDialogOpen}
                handleDialogClose={handleDialogClose}
                handleSDialogOpen={handleSDialogOpen}
                handleSDialogClose={handleSDialogClose}
                onClickVerify={onClickVerify}
            />
        </MainLayout>
    );
}