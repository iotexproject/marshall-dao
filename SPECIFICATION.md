# Marshall DAO Specification

## Definitions

- Epoch: An epoch is one week in length. After 4 years, 
the day of the week it resets on will shift.

## Token

### VotingEscrow

The VotingEscrow contracts allow users to escrow their $IOTX or Liquid Staked IOTX tokens in an veIOTX NFT.
The (ERC-721 compliant) NFT has a balance which represents the voting weight of the
escrowed tokens, which decays linearly over time. Tokens can be locked for a maximum
of four years. veIOTX NFT vote weights can be used to vote for IoTeX ecosystem protocols, 
which in turn determines the proportion of weekly emissions that go to each protocol.
VotingEscrow's clock mode is timestamps (see EIP-6372). Metadata updates (EIP-4906) are also supported. 

Normal NFTs can also be in a new state that is known as a permanent lock. While 
permanently locked, normal NFTs will have voting power that will be equal to the
amount of veIOTX that was locked to create it. The NFT's voting power will also
not decay. Permanent locks can be unlocked as long as you have not voted that epoch. 
Managed NFTs are permanent locks by default.

Standard Operations:
All of these operations require ownership of the underlying NFT or tokens being escrowed. 
- Can create a NFT by escrowing $IOTX tokens and "locking" them for a time period.
- Can do anything with the NFT as supported by the ERC-721 interface.
- Can merge one NFT into another (requires normal NFT for `from`, but can be normal permanent for `to`).
- Can split a single NFT into two new NFTs (requires normal or normal permanent NFT).  The NFT to be split is burned.  
    - By permissioning split to an address, any normal NFTs owned by the address are able to be split.
    - Split is initially permissioned by address and can be toggled on/off (requires team).
    - In addition, there are split toggle on/off permissions protocol-wide (requires team)
- Can withdraw escrowed $IOTX tokens once the NFT lock expires. 
- Can add to an existing NFT position by escrowing additional $IOTX tokens.
- Can increase the lock duration of an NFT.
- Can permanent lock a NFT to lock its voting power at the maximum and prevent decay.
- Can unlock a permanently locked NFT to allow its voting power to decay.
- Can delegate votes to other `tokenId`s for use in marshall governance to other addresses based on voting power. Voting power retrieved from `getVotes` and `getPastVotes` does not reveal locked amount balances and are used only for voting. 

### Vault

The minting contract handles emissions for the Marshall DAO protocol. Emissions start fixed amount $IOTX per epoch (7 days). Liquidity providers and veIOTX holder will receive weekly emissions. The weekly emissions amount and the ratio of the LP and veIOTX can be adjust by DAO governor.

## RewardsDistributor

Standard Curve-fee distribution contract, modified for use with rebases. Rebases
are calculated based on the locked and unlocked IOTX one second prior to epoch flip.
veNFTs will earn rebases proportionally based on their contribution to the total locked IOTX.
Rebase claims against expired veNFTs will be distributed as unlocked IOTX to the owner of the veNFT.

## Protocol

### Gauge

The gauge contract is a standard rewards contract in charge of distributing emissions to LP depositors. Users that deposit LP tokens can forgo their fee reward in exchange for a proportional distribution of emissions (proportional to their share of LP deposits in the gauge).

Standard Operations:
- Can deposit LP tokens.
- Can deposit LP tokens for another receipient. 
- Can withdraw LP tokens. 
- Can get emission rewards for an account. 
- Can deposit emissions into gauge (requires `Voter`).

### Reward

The base reward contract for all reward contracts. Individual voting balance checkpoints and total supply checkpoints are created in a reward contract whenever a user votes for a pool. Checkpoints do not automatically update when voting power decays (requires `Voter.poke`). Rewards in these contracts are distributed proportionally to an NFT's voting power contribution to a pool. An NFT is distributed rewards in each epoch proportional to its voting power contribution in that epoch. 

#### VotingReward

Voting rewards are rewards that accrue to users that vote for a specific pool. They can be broken down into fees and bribes.

#### BribeVotingReward

Bribe voting rewards are externally deposited rewards of whitelisted tokens (see Voter) used to incentivize users to vote for a given pool.

### Governance

### Governor

Lightly modified from OpenZeppelin's Governor contract. Enables governance by using timestamp based voting power from VotingEscrow NFTs. Includes support for vetoing of proposals as mitigation against 51% attacks. proposalHash has also been modified to include the proposer to prevent griefing attacks from proposal frontrunning. Votes are cast and counted on a per tokenId basis.
