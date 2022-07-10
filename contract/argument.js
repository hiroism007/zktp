const ethers = require("hardhat").ethers;

module.exports = [
  [
    {
      merkleTreeDepth: 20,
      contractAddress: "0x37DC1CB7Ab684A2AF97862ce42244Fc9293f1a0E",
    },
  ],
  [
    "0x0C7f08080d325dae4072B45CdE3a73717E3a7223",
    "0x199012076Ea09f92D8C30C494E94738CFF449f57",
  ],
  ethers.utils.parseEther("0.01"),
];
