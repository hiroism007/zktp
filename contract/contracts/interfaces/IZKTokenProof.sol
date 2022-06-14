//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// @title ZKTokenProof interface.
/// @dev Interface of a ZKTokenProof contract.
interface IZKTokenProof {
    struct Verifier {
        address contractAddress;
        uint8 merkleTreeDepth;
    }

    struct Event {
        address adminAddress;
        address contractAddress;
        string title;
        uint256 fee;
        uint256 createdAt;
    }

    /// @dev Emitted when a new event is created.
    /// @param eventId: Id of the group.
    /// @param depth: Depth of the tree.
    /// @param zeroValue: Zero value of the tree.
    /// @param contractAddress: Target NFT contract address.
    /// @param adminAddress: Admin of the group.
    /// @param title: Event title for the event.
    /// @param fee: Event fee that admin can earn for the event.
    event EventCreated(
        uint256 indexed eventId,
        uint8 depth,
        uint256 zeroValue,
        address indexed contractAddress,
        address indexed adminAddress,
        string title,
        uint256 fee
    );

    /// @dev Emitted when withdrawn
    event Withdraw(address indexed operator);

    /// @dev Get contract address of event.
    /// @param _eventId: eventId to fetch contract address.
    function eventContractAddressOf(uint256 _eventId)
        external
        view
        returns (address);

    /// @dev Get contract address of event.
    /// @param _eventId: eventId to fetch contract address.
    function eventFeeOf(uint256 _eventId) external view returns (uint256);

    /// @dev Create an event.
    /// @param _eventId: Id of the group.
    /// @param _depth: Depth of the tree.
    /// @param _zeroValue: Zero value of the tree.
    /// @param _contractAddress: Target NFT contract address.
    /// @param _title: Event title.
    /// @param _fee: Fee for event participation.
    function createEvent(
        uint256 _eventId,
        uint8 _depth,
        uint256 _zeroValue,
        address _contractAddress,
        string calldata _title,
        uint256 _fee
    ) external payable;

    /// @dev Withdraw values in this contract.
    function withdraw() external;
}
