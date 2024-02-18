## Marchall DAO

**Marshall DAO is a Decentralized Autonomous Organization (DAO) that will employ a vote-escrow on-chain governance protocol.**

See [SPECIFICATION.md](./SPECIFICATION.md) for more detail.

### Protocol Overview

#### VotingEscrow contracts

| Filename | Description |
| --- | --- |
| `VotingEscrow.sol` | Protocol ERC-721 (ve)NFT representing the protocol vote-escrow lock. Beyond standard ve-type functions, there is also the ability to merge and split nfts. And support $IOTX, $stIOTX and native staked buckets create ve. |
| `Vault.sol` | Protocol token Vault. Distributes emissions to `Voter.sol` and distribute to `RewardsDistributor.sol`. The vault also can accept donate from other projects. |
| `RewardsDistributor.sol` | Is used to handle the distribution for (ve)NFTs/lockers. |
| `VeArtProxy.sol` | (ve)NFT art proxy contract, exists for upgradability purposes |

#### Protocol mechanics contracts

| Filename | Description |
| --- | --- |
| `Voter.sol` | Handles votes for the current epoch, gauge and voting reward creation as well as emission distribution to `Gauge.sol` contracts. |
| `Gauge.sol` | Gauges are attached to a Pool and based on the (ve)NFT votes it receives, it distributes proportional emissions in the form of protocol tokens. Deposits to the gauge take the form of LP tokens for the Pool. In exchange for receiving protocol emissions, claims on fees from the pool are relinquished to the gauge. Standard rewards contract. |
| `rewards/` | |
| `Reward.sol` | Base reward contract to be inherited for distribution of rewards to stakers.
| `VotingReward.sol` | Rewards contracts used by `BribeVotingReward.sol` which inherits `Reward.sol`. Rewards are distributed in the following epoch proportionally based on the last checkpoint created by the user, and are earned through "voting" for a pool or gauge. |
| `BribeVotingReward.sol` | Stores the users/externally provided rewards for the current voting epoch to it's voters. These are deposited externally every week. |

#### Governance contracts

| Filename | Description |
| --- | --- |
| `VetoGovernor.sol` | OpenZeppelin's Governor contracts used in protocol-wide access control to whitelist tokens for gauges within Marshall DAO, and update minting emissions. |

### Deployment

#### Testnet

```
LST Token: 0x180dC617701A507239659215D19FA142eD3B91A7
Forwarder deployed to 0xcaf680C79bc8375bF7B221710C3196848c4c7407
BalanceLogicLibrary deployed to 0x97d27CC3d84c0a49Cc0289f9f0BA519dD6549641
DelegationLogicLibrary deployed to 0x2c7862C0D2dE3deDaf324745A13a64733E80868a
VotingEscrow deployed to 0x313A05E0CE2D559793350d6afa7b7e1d5D2Ec21e
VeArtProxy deployed to 0x85B6E973EF283727A2c7E2D8D6C86AE8bcAb8029
MarshallGovernor deployed to 0x2aA69bdae4A8b68DC7782492ad4DbC4aB44eF6f6
EmptyPoolFactory deployed to 0x3AD7F5C76499CEa84b3554bA9564F5EA14b4ab1A
VotingRewardsFactory deployed to 0x23B0a499f782f1C5E66cc3C6faF7dFEf1cdB5a70
GaugeFactory deployed to 0x8d69D02DA627F4386675E0DF7E6b3A6F85cB0cd7
FactoryRegistry deployed to 0xAf4d71cd7947468ee1b383f5360ee8d391a0862a
Voter deployed to 0x8f22A8fD3B525A827E57961b8981f4f463a17420
RewardsDistributor deployed to 0x0ee041ed5d32C0d10E6B1abf6Ac5c4BF01e0a866
Vault deployed to 0x58cCdd725EEb53efd4465a06354312D9fd9B3dbD
```

#### Mainnet

```
Forwarder deployed to 0x9E6789DBAD3BBAe804414bE53a35d47b95Ebd646
BalanceLogicLibrary deployed to 0xc1524F19476496A3bFd62F6AC230C09C255F7dF8
DelegationLogicLibrary deployed to 0x6FD19239d1018aCc89251060f9D1CEEa68ee0987
VotingEscrow deployed to 0x0f502d9b38D2fDF687f411C6ADaE565F16c56Cb8
VeArtProxy deployed to 0xe0c3416DcE876Fa04Ed9a2E332b3c420F8B5E9a3
MarshallGovernor deployed to 0xc7761C75970C196CF888552DeAFd9128a3116bae
EmptyPoolFactory deployed to 0x4eB49c8fB8b3A7771f924375111E890bef22E682
VotingRewardsFactory deployed to 0xeB9927669a58FC22219a60bf13560b85cc842545
GaugeFactory deployed to 0xF5e8142889a49b34505CF61a685090D7BCcF7384
FactoryRegistry deployed to 0x149fcF5fb81E41a774F84d2d48996Bd5D9A422eA
Voter deployed to 0xe29B18F7f1237Cf7A681c87B1c9D9A10a996176C
RewardsDistributor deployed to 0x182ED2202b1F1024849C74ea4739Abc8adD1466B
Vault deployed to 0x6382366Dd7A612e98663AF1e6826b272C815c8D9
```
