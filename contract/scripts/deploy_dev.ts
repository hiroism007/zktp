// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { poseidon_gencontract as poseidonContract } from "circomlibjs";

async function main() {
  const [signer] = await ethers.getSigners();

  /**
   * Mock ERC721
   */
  const baseTokenURI = "https://example.com/tokens";
  const registryAddress = "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A"; // Rinkeby
  const baseContractURI = "https://contract.example.com/";

  const Mock = await ethers.getContractFactory("MockERC721");
  const m = await Mock.deploy(baseTokenURI, baseContractURI, registryAddress);
  await m.deployed();

  /**
   * Poseidon
   */
  const poseidonABI = poseidonContract.generateABI(2);
  const poseidonBytecode = poseidonContract.createCode(2);
  const PoseidonLibFactory = new ethers.ContractFactory(
    poseidonABI,
    poseidonBytecode,
    signer
  );
  const poseidonLib = await PoseidonLibFactory.deploy();
  await poseidonLib.deployed();

  /**
   * IncrementalMerkleTree
   */
  const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory(
    "IncrementalBinaryTree",
    {
      libraries: {
        PoseidonT3: poseidonLib.address,
      },
    }
  );
  const incrementalBinaryTreeLib =
    await IncrementalBinaryTreeLibFactory.deploy();
  await incrementalBinaryTreeLib.deployed();

  /**
   * ZKTP
   */
  const ZKTP = await ethers.getContractFactory("ZKTokenProof", {
    libraries: {
      IncrementalBinaryTree: incrementalBinaryTreeLib.address,
    },
  });
  const zktp = await ZKTP.deploy(
    [
      {
        merkleTreeDepth: 20,
        contractAddress: "0x2a96c5696F85e3d2aa918496806B5c5a4D93E099",
      },
    ],
    [signer.address],
    ethers.utils.parseEther("0.01")
  );

  await zktp.deployed();

  console.log("mock ERC721 deployed to:", m.address);
  console.log("verifier to:", "0x2a96c5696F85e3d2aa918496806B5c5a4D93E099");
  console.log("zktp deployed to:", zktp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
