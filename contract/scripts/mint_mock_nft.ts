// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { MockERC721__factory } from "../typechain";

const MOCK_ADDRESS = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = MockERC721__factory.connect(MOCK_ADDRESS, signer);
  await contract.mint();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
