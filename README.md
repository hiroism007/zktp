
ZKTokenProof delivers a decentralized seamless Zero Knowledge based token-gating solution for real-world and online use cases of ticketing features with privacy.

Anyone can easily mange limited events for ticketing, token-gating where only those with a particular NFT and participants can prove that they have one of the NFT without revealing their wallet addresses.

This project is currently on [Polygon Matic network](https://polygon.technology/solutions/polygon-pos/) and frontend is hosted on [Vercel](https://vercel.com/).

ZKTokenProof Link

https://polygon.zktokenproof.xyz/

Demo Video

https://youtube.com/hoghoge

## Problems Behind Current NFT Ticketing

A lot of NFT ticketing services are based on ECDSA signature and verification, which derives the address at the end of verification process.

This means it’s possible for the malicious event operator or someone else doing the ticketing at the real world event to identify the derived address as his/hers.

They will be a prime target for criminals who want to physically rob them of their assets not only in the Web3 but also in the real world.

The problem for users is that they need to bring their wallet, such as Metamask Mobile App, to the events to prove their ownership.

## Our Solution With Semaphore

[Semaphore](https://semaphore.appliedzkp.org/) allows Ethereum users to prove their membership of a group and send signals such as votes or endorsements without revealing their original identity. 

With their circuits and verification system on smart contracts, ZKTokenProof enables users prove their membership (ownership) of particular NFT without revealing their wallet addresses.

## Competitors
[tokenproof](https://tokenproof.xyz/) is a competitor of our project. They introduces safe token-gating solutions, enabling users to prove ownership of NFTs. However, their product is too centralized thought it is useful as the technology behind them is Web2.

## Project Structure
The project has three main folders within root directory:

* contract/
* frontend/
* subgraph/

### contract
The contract folder contains all the smart contracts used in ZKTokenProof.

### frontend
The frontend folder contains frontend files built with [Nextjs](https://nextjs.org/).

### subgraph
The subgraph folder contains all the sugbraph related files built with [The Graph](https://thegraph.com/en/), which enables us to retrieve all the event data to build MerkleTree on frontend in decentralized way.


## Deployed contracts

### Polygon Matic

| Name | Contract Address | Status |
| ---- | ---- | --- |
| ZKTokenProof| 0x4B25e2F00F9320F9802C2A734b1890F1E41c77db | Verified |
|  Verifier20  |  0x37DC1CB7Ab684A2AF97862ce42244Fc9293f1a0E  | Verified |
|  PoseidonT3  |  0xc252DffB193082930E17Dd486894727C136aA71B  | Not Yet |
| TreeLib|0x325CC80c4b5ffFD1Be186adBd2ba43aB2cfaB460 | Verified |