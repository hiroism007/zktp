//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// TODO move to interfaces/IZKTokenProof.sol
interface IZKTokenProof {
    function contractAddressOfGroup(uint256 _groupId)
        external
        view
        returns (address);
}

error Unauthorized();

contract Registrant {
    event Register(uint256 groupId, uint256 identityCommitment);

    address public immutable zkTokenProof;

    constructor(address _zkTokenProof) {
        zkTokenProof = _zkTokenProof;
    }

    function register(uint256 _groupId, uint256 _identityCommitment)
        external
        payable
    {
        if (
            IERC721(
                IZKTokenProof(zkTokenProof).contractAddressOfGroup(_groupId)
            ).balanceOf(msg.sender) == 0
        ) {
            revert Unauthorized();
        }
        // only emit event here and relayers watch/queue events to send transactions instead of msg.sender for privacy.abi
        // FIXME need to consider the way to insentivise relayers.
        emit Register(_groupId, _identityCommitment);
    }
}
