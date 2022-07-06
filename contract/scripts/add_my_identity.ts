// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ZKTokenProof__factory } from "../typechain";

const ZKTP_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = ZKTokenProof__factory.connect(ZKTP_ADDRESS, signer);

  const groupId =
    "17866877775703022293542291874016962135982316666712183007466411048636900048777";
  const identityCommitment =
    "10678638114444808240153728495756441751151920215048355637207158567245638457596";
  const tx = await contract.addMember(groupId, identityCommitment);
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
