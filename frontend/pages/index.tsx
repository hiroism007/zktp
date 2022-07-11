import React from "react";
import { Identity } from "@semaphore-protocol/identity";
import { useConnect, useSignMessage, useAccount } from "wagmi";

import { utils } from "ethers";
import MainLayout from "../layouts/Main";
import HomeTemplate from "../templates/Home";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSnackbar } from "notistack";

export default function Home() {
    /**
     * 1. connect wallet
     * 2. find local identityCommitment
     * 3. if yes, skip below, if not, do below.
     * 4. create random string to sign
     * 5. signMessage
     * 6. create identity from the signed message
     */

    const { enqueueSnackbar } = useSnackbar();

    const [address, setAddress] = React.useState("");

    const { address: account, isConnected } = useAccount();

    const [identityCommitment, setIdentityCommitment] = useLocalStorage(
        "identityCommitment",
        ""
    );

    const { signMessage } = useSignMessage({
        onSettled(data) {
            const identityCommitment = new Identity(data);
            console.log(identityCommitment.toString());
            setIdentityCommitment(identityCommitment.toString());
        },
    });

    const { connect, connectors } = useConnect({
        onSettled() {
            if (!identityCommitment) {
                const message = {
                    app: "ZKTokenProof",
                    operation: "Generate Identity",
                    challenge: utils.randomBytes(32).toString(),
                };
                const messageToSign = JSON.stringify(message, null, 2);
                signMessage({ message: messageToSign });
            }
        },
    });

    React.useEffect(() => {
        if (isConnected) {
            setAddress(account || "");
        } else {
            setAddress("");
        }
    }, [account, enqueueSnackbar, isConnected]);

    return (
        <MainLayout
            loading={false}
            setLoading={() => {
                // do nothing
            }}
            onClickConnect={() => {
                connect({ connector: connectors[0] });
            }}
            title={"ZKTokenProof"}
        >
            <HomeTemplate address={address} />
        </MainLayout>
    );
}
