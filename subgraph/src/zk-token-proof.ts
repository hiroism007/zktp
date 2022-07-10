import { BigInt } from "@graphprotocol/graph-ts"
import {
  ZKTokenProof,
  EventCreated,
  GroupCreated,
  MemberAdded,
  MemberRemoved,
  NullifierHashAdded,
  OwnershipTransferred,
  RelayerAdded,
  RelayerRemoved,
  VerifierAdded,
  VerifierRemoved,
  Withdraw
} from "../generated/ZKTokenProof/ZKTokenProof"
import { ZkEvent } from "../generated/schema"

export function handleEventCreated(event: EventCreated): void {
  let entity = ZkEvent.load(event.params.eventId.toString())
  if (!entity) {
    entity = new ZkEvent(event.params.eventId.toString())
    entity.adminAddress = event.params.adminAddress
    entity.contractAddress = event.params.contractAddress
    entity.eventId = event.params.eventId
    entity.fee = event.params.fee
    entity.members = []
    entity.depth = event.params.depth
  }
  entity.save()
}

export function handleGroupCreated(event: GroupCreated): void {}

export function handleMemberAdded(event: MemberAdded): void {
  let entity = ZkEvent.load(event.params.groupId.toString())

  if (entity) {
    let members = entity.members
    members.push(event.params.identityCommitment)
    entity.members = members
    entity.currentRoot = event.params.root
    entity.save()
  }
}

export function handleMemberRemoved(event: MemberRemoved): void {
  let entity = ZkEvent.load(event.params.groupId.toString())
  if (entity) {
    let members:Array<BigInt> = []

    for (let i =0; i < entity.members.length; i++) {
      if (!entity.members[i].equals(event.params.identityCommitment)) {
        members.push(entity.members[i])
      }
    }
    
    entity.members = members
    entity.currentRoot = event.params.root
    entity.save()
  }
}

export function handleNullifierHashAdded(event: NullifierHashAdded): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRelayerAdded(event: RelayerAdded): void {}

export function handleRelayerRemoved(event: RelayerRemoved): void {}

export function handleVerifierAdded(event: VerifierAdded): void {}

export function handleVerifierRemoved(event: VerifierRemoved): void {}

export function handleWithdraw(event: Withdraw): void {}
