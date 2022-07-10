import React from "react";
import { Identity } from "@semaphore-protocol/identity";
import { useConnect, useSignMessage, useAccount } from "wagmi";
import { utils } from "ethers";
import MainLayout from "../layouts/Main";
import HomeTemplate from "../templates/Home";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Home() {
    /**
     * 1. connect wallet
     * 2. find local identityCommitment
     * 3. if yes, skip below, if not, do below.
     * 4. create random string to sign
     * 5. signMessage
     * 6. create identity from the signed message
     */

    const [address, setAddress] = React.useState("");

    const { data: account } = useAccount();

    const [identityCommitment, setIdentityCommitment] = useLocalStorage(
        "identityCommitment",
        ""
    );

    const { signMessage } = useSignMessage({
        onSettled(data) {
            const identityCommitment = new Identity(data);
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
        if (account) {
            setAddress(account.address || "");
        } else {
            setAddress("");
        }
    }, [account]);

    return (
        <MainLayout
            loading={false}
            setLoading={() => {
                // do nothing
            }}
            onClickConnect={() => {
                connect(connectors[0]);
            }}
        >
            <HomeTemplate address={address} />
        </MainLayout>
    );
}
