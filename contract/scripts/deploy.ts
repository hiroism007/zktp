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
  const baseTokenURI = "https://metadata-api-m353slxifa-uw.a.run.app/token/";
  const registryAddress = "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A"; // Rinkeby
  // const registryAddress = "0xa5409ec958C83C3f309868babACA7c86DCB077c1";
  const baseContractURI =
    "https://metadata-api-m353slxifa-uw.a.run.app/contract";

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
   * Relayer
   */
  const Relayer = await ethers.getContractFactory("Registrant");
  const r = await Relayer.deploy();
  await r.deployed();

  /**
   * Verifier20
   */
  const Verifier = await ethers.getContractFactory(`Verifier20`);
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
    [r.address, signer.address],
    ethers.utils.parseEther("0.01")
  );

  await zktp.deployed();

  console.log("mock deployed to:", m.address);
  console.log("registrant deployed to:", r.address);
  console.log("verifier deployed to:", v.address);
  console.log("zktp deployed to:", zktp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
