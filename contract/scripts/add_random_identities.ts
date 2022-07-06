// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ZKTokenProof__factory } from "../typechain";
import { Identity } from "@semaphore-protocol/identity";

const ZKTP_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = ZKTokenProof__factory.connect(ZKTP_ADDRESS, signer);

  const groupId =
    "17866877775703022293542291874016962135982316666712183007466411048636900048777";

  for (let i = 0; i < 10; i++) {
    const identityCommitment = new Identity();
    const tx = await contract.addMember(
      groupId,
      identityCommitment.generateCommitment()
    );
    console.log(tx.hash);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
