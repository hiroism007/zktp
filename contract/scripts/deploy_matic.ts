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
   * Verifier20
   */
  const Verifier = await ethers.getContractFactory("Verifier20");
  const v = await Verifier.deploy();
  await v.deployed();

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
        contractAddress: v.address,
      },
    ],
    [signer.address, "0x199012076Ea09f92D8C30C494E94738CFF449f57"],
    ethers.utils.parseEther("0.01")
  );

  await zktp.deployed();

  console.log("poseidon deployed to:", poseidonLib.address);
  console.log("tree deployed to:", incrementalBinaryTreeLib.address);
  console.log("verifier deployed to:", v.address);
  console.log("zktp deployed to:", zktp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
