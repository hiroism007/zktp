import { BigNumber } from "ethers";
import { BigNumberish } from "@semaphore-protocol/proof";
import { SolidityProof } from "@semaphore-protocol/proof/dist/types/types";

export type Event = {
    contractAddress?: string;
    adminAddress?: string;
    fee?: BigNumber;
    title?: string;
};

export type QR = {
    id?: string;
    signal?: string;
    nullifierHash?: BigNumberish;
    externalNullifier?: string;
    proof?: SolidityProof;
};
