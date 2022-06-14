//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IZKTokenProof.sol";

error Unauthorized();

contract Registrant is Ownable {
    event Register(uint256 eventId, uint256 identityCommitment);
    event Withdraw(address indexed operator);
    error InsufficientFee(uint256 requiredFee, uint256 actual);

    address public immutable zkTokenProof;

    constructor(address _zkTokenProof) {
        zkTokenProof = _zkTokenProof;
    }

    /**
     * Receive function
     */
    receive() external payable {}

    /**
     * Fallback function
     */
    fallback() external payable {}

    function register(uint256 _eventId, uint256 _identityCommitment)
        external
        payable
    {
        IZKTokenProof zktp = IZKTokenProof(zkTokenProof);

        if (
            IERC721(zktp.eventContractAddressOf(_eventId)).balanceOf(
                msg.sender
            ) == 0
        ) {
            revert Unauthorized();
        }

        uint256 fee = zktp.eventFeeOf(_eventId);
        if (fee > msg.value) {
            revert InsufficientFee(fee, msg.value);
        }

        // only emit event here and relayers watch/queue events to send transactions instead of msg.sender for privacy.abi
        // FIXME need to consider the way to insentivise relayers.
        emit Register(_eventId, _identityCommitment);
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Not Enough Balance Of Contract");
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer Failed");
        emit Withdraw(msg.sender);
    }
}
