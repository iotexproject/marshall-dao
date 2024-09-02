## Marchall DAO

**Marshall DAO is a Decentralized Autonomous Organization (DAO) that will employ a vote-escrow on-chain governance protocol.**

See [SPECIFICATION.md](./SPECIFICATION.md) for more detail.

### Protocol Overview

#### VotingEscrow contracts

| Filename | Description |
| --- | --- |
| `Vault.sol` | Protocol token Vault. Distributes emissions to `Voter.sol` and distribute to `RewardsDistributor.sol`. The vault also can accept donate from other projects. |
| `RewardsDistributor.sol` | Is used to handle the distribution for (ve)NFTs/lockers. |

#### Protocol mechanics contracts

| Filename | Description |
| --- | --- |
| `Voter.sol` | Handles votes for the current epoch, gauge and voting reward creation as well as emission distribution to `Gauge.sol` contracts. |
| `Gauge.sol` | Gauges are attached to a Pool and based on the (ve)NFT votes it receives, it distributes proportional emissions in the form of protocol tokens. Deposits to the gauge take the form of LP tokens for the Pool. In exchange for receiving protocol emissions, claims on fees from the pool are relinquished to the gauge. Standard rewards contract. |


### Deployment

#### Testnet

```
StrategyManager deployed to 0xEa0e85eE83c176b166c83A0dC20abA59ef80f864
Forwarder deployed to 0xbB75b4f49529e217C60B762Cc5bEd9e418142f98
EmptyPoolFactory deployed to 0xA88958078085b1662FB4f5B7f992F76781917F13
GaugeFactory deployed to 0x9F8e01ba4A996152bdd48cE4BF6e6fD3A79b9149
FactoryRegistry deployed to 0x37adcCFc183030cFA8AC696c04711cC4a1401de1
Voter deployed to 0x34c18bccE72C7FD891F6aBB54874F1a5067C86cc
RewardsDistributor deployed to 0xCDBcBF82fE1534b54A2B55FA45Df0CD0C940fd8a
Vault deployed to 0xC79Ceda1244Fc91472800E9e245C9c8014E95284
```

#### Mainnet

```
Forwarder deployed to 
EmptyPoolFactory deployed to 
VotingRewardsFactory deployed to 
GaugeFactory deployed to 
FactoryRegistry deployed to 
Voter deployed to 
RewardsDistributor deployed to 
Vault deployed to 
BatchClaimVault deployed to 0x26f0508DD630731DC0e7d75A856f984deB29cea3
```
