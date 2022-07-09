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

    /// @dev Emmited when verifier added
    /// @param verifier: Added verifier.
    event VerifierAdded(Verifier verifier);

    /// @dev Emmited when verifier removed
    /// @param verifier: Removed verifier.
    event VerifierRemoved(Verifier verifier);

    /// @dev Emmited when relayer added
    /// @param relayerAddress: Added relayer address.
    event RelayerAdded(address indexed relayerAddress);

    /// @dev Emmited when relayer removed
    /// @param relayerAddress: Removed relayer address.
    event RelayerRemoved(address indexed relayerAddress);

    /// @dev Emitted when withdrawn
    event Withdraw(address indexed operator);

    /// @dev Check if the target address is eligible to join the event
    /// @param _eventId: Id of the event.
    /// @param _target: Address to check the eligibility.
    /// @return bool
    function isEligible(uint256 _eventId, address _target)
        external
        view
        returns (bool);

    /// @dev Prove membership
    /// @param _eventId: Id of the event.
    /// @param _signal: Signal.
    /// @param _nullifierHash: NullifierHash.
    /// @param _externalNullifier: ExternalNullifier.
    /// @param _proof: Proof.
    /// @return bool
    function verifyMembership(
        uint256 _eventId,
        bytes32 _signal,
        uint256 _nullifierHash,
        uint256 _externalNullifier,
        uint256[8] calldata _proof
    ) external view returns (bool);

    /// @dev Prove membership, pay fee and save nullifierHash.
    /// @param _eventId: Id of the event.
    /// @param _signal: Signal.
    /// @param _nullifierHash: NullifierHash.
    /// @param _externalNullifier: ExternalNullifier.
    /// @param _proof: Proof.
    function verifyMembershipWithFee(
        uint256 _eventId,
        bytes32 _signal,
        uint256 _nullifierHash,
        uint256 _externalNullifier,
        uint256[8] calldata _proof
    ) external payable;

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

    /// @dev Add member to the event by relayers.
    /// @param _eventId: Id of the event.
    /// @param _identityCommitment: Identity Commitment of participant.
    function addMember(uint256 _eventId, uint256 _identityCommitment) external;

    /// @dev Remove member to the event by relayers.
    /// @param _eventId: Id of the event.
    /// @param _identityCommitment: Identity Commitment of participant.
    /// @param _proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param _proofPathIndices: Path of the proof of membership.
    function removeMember(
        uint256 _eventId,
        uint256 _identityCommitment,
        uint256[] calldata _proofSiblings,
        uint8[] calldata _proofPathIndices
    ) external;

    /// @dev Add a relayer
    /// @param _relayer: Relayer address to be added.
    function addRelayer(address _relayer) external;

    /// @dev Remove a relayer
    /// @param _relayer: Relayer address to be removed.
    function removeRelayer(address _relayer) external;

    /// @dev Withdraw values in this contract.
    function withdraw() external;
}
