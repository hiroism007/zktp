//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";

error NotRelayer(address relayerAddress);
error InvalidTreeDepth(uint8 depth);

// TODO move to interfaces/
struct Verifier {
    address contractAddress;
    uint8 merkleTreeDepth;
}

contract ZKTokenProof is SemaphoreCore, SemaphoreGroups {
    /// @dev Gets a tree depth and returns its verifier address.
    mapping(uint8 => IVerifier) public verifiers;

    /// @dev Mapping of relayers
    mapping(address => bool) public relayers;

    /// @dev Checks if there is a verifier for the given tree depth.
    /// @param depth: Depth of the tree.
    modifier onlySupportedDepth(uint8 depth) {
        if (address(verifiers[depth]) != address(0)) {
            revert InvalidTreeDepth(depth);
        }
        _;
    }

    /// @dev Checks if the msg.sender is one of the relayers.
    modifier onlyRelayer() {
        if (!relayers[_msgSender()]) {
            revert NotRelayer(_msgSender());
        }
        _;
    }

    /// @dev Initializes the Semaphore verifiers, relayers used to verify the user's ZK proofs, to add members to group.
    /// @param _verifiers: List of Semaphore verifiers (address and related Merkle tree depth).
    /// @param _relayers: List of relayers' addresses.
    constructor(Verifier[] memory _verifiers, address[] memory _relayers) {
        for (uint8 i = 0; i < _verifiers.length; i++) {
            verifiers[_verifiers[i].merkleTreeDepth] = IVerifier(
                _verifiers[i].contractAddress
            );
        }
        for (uint256 i = 0; i < _relayers.length; i++) {
            relayers[_relayers[i]] = true;
        }
    }
}
