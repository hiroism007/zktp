//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";

import "./interfaces/IZKTokenProof.sol";

error NotRelayer(address relayerAddress);
error InvalidTreeDepth(uint8 depth);
error GroupNotFound(uint256 eventId);
error InsufficientFee(uint256 requiredFee, uint256 actual);
error InvalidContractAddress(address contractAddress);

contract ZKTokenProof is
    IZKTokenProof,
    SemaphoreCore,
    SemaphoreGroups,
    Ownable
{
    /// @dev fee for each event creation
    uint256 public fee;

    /// @dev Gets a tree depth and returns its verifier address.
    mapping(uint8 => IVerifier) public verifiers;
    /// @dev Mapping of relayers.
    mapping(address => bool) public relayers;
    /// @dev Mappng of events.
    mapping(uint256 => Event) public events;

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
    /// @param _fee: fee of each event creation.
    constructor(
        Verifier[] memory _verifiers,
        address[] memory _relayers,
        uint256 _fee
    ) {
        uint8 i = 0;
        for (; i < _verifiers.length; i++) {
            verifiers[_verifiers[i].merkleTreeDepth] = IVerifier(
                _verifiers[i].contractAddress
            );
        }
        for (i = 0; i < _relayers.length; i++) {
            relayers[_relayers[i]] = true;
        }
        fee = _fee;
    }

    /**
     * Receive function
     */
    receive() external payable {}

    /**
     * Fallback function
     */
    fallback() external payable {}

    ///@dev see {IZKTokenProof-eventContractAddressOf}.
    function eventContractAddressOf(uint256 _eventId)
        public
        view
        returns (address)
    {
        if (getRoot(_eventId) == 0) {
            revert GroupNotFound(_eventId);
        }
        return events[_eventId].contractAddress;
    }

    ///@dev see {IZKTokenProof-eventFeeOf}.
    function eventFeeOf(uint256 _eventId) public view returns (uint256) {
        if (getRoot(_eventId) == 0) {
            revert GroupNotFound(_eventId);
        }
        return events[_eventId].fee;
    }

    ///@dev see {IZKTokenProof-createEvent}.
    function createEvent(
        uint256 _eventId,
        uint8 _depth,
        uint256 _zeroValue,
        address _contractAddress,
        string calldata _title,
        uint256 _fee
    ) external payable override onlySupportedDepth(_depth) {
        // check event creation fee
        if (msg.value < fee) {
            revert InsufficientFee(fee, msg.value);
        }

        // check if the contract address has the ERC721 interface
        bytes4 ERC721InterfaceId = type(IERC721).interfaceId;
        if (!IERC721(_contractAddress).supportsInterface(ERC721InterfaceId)) {
            revert InvalidContractAddress(_contractAddress);
        }

        // create group
        _createGroup(_eventId, _depth, _zeroValue);
        // create event
        events[_eventId] = Event({
            adminAddress: msg.sender,
            contractAddress: _contractAddress,
            title: _title,
            fee: _fee,
            createdAt: block.timestamp
        });
        // emit event
        emit EventCreated(
            _eventId,
            _depth,
            _zeroValue,
            _contractAddress,
            msg.sender,
            _title,
            _fee
        );
    }

    ///@dev see {{IZKTokenProof-withdraw}
    /// FIXME do I need to check if the identityCommitment is already inserted?
    function addMember(uint256 _eventId, uint256 _identityCommitment)
        public
        override
        onlyRelayer
    {}

    ///@dev see {IZKTokenProof-withdraw}
    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Not Enough Balance Of Contract");
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer Failed");
        emit Withdraw(msg.sender);
    }
}
