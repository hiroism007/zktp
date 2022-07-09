import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import { ZKTokenProof__factory } from "../../types/typechain";
import { ZK_TOKEN_PROOF_ADDRESS } from "../../utilities/constants";

// let provider:
//     | ethers.providers.JsonRpcProvider
//     | ethers.providers.AlchemyProvider;
//
// if (process.env.NODE_ENV === "development") {
//     provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
// } else {
//     provider = new ethers.providers.AlchemyProvider(
//         "goerli",
//         process.env.ALCHEMY_APIKEY
//     );
// }

const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_APIKEY
);

const signer = new ethers.Wallet(process.env.SIGNER_PK as string, provider);
const contract = ZKTokenProof__factory.connect(ZK_TOKEN_PROOF_ADDRESS, signer);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { eventId, address, identityCommitment } = JSON.parse(req.body);

    try {
        const isEligible = await contract.isEligible(eventId, address);
        if (!isEligible) {
            return res.status(400).send("Not eligible to join this event.");
        }

        // FIXME how to incentivize relayer?
        const tx = await contract.addMember(eventId, identityCommitment);
        console.log(tx.hash);
        res.status(200).end();
    } catch (error: any) {
        const { message } = JSON.parse(error.body).error;
        const reason = message.substring(
            message.indexOf("'") + 1,
            message.lastIndexOf("'")
        );
        res.status(500).send(reason || "Unknown error!");
    }
}
