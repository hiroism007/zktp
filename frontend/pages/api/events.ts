import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import { ZKTokenProof__factory } from "../../utilities/typechain";
import { ZK_TOKEN_PROOF_ADDRESS } from "../../utilities/constants";

const provider = new ethers.providers.AlchemyProvider(
    process.env.NETWORK,
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

        const feeData = await provider.getFeeData();

        if (!feeData.gasPrice) {
            return res.status(500).send("Failed to fetch fee data!");
        }

        const tx = await contract.addMember(eventId, identityCommitment, {
            gasPrice: feeData.gasPrice,
        });
        console.log(tx.hash);
        return res.status(200).end();
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { message } = JSON.parse(error.body).error;
        const reason = message.substring(
            message.indexOf("'") + 1,
            message.lastIndexOf("'")
        );
        return res.status(500).send(reason || "Unknown error!");
    }
}
