# Marshall DAO Specification

## Definitions

- Epoch: An epoch is one week in length. After 4 years, 
the day of the week it resets on will shift.

## Token

### VotingEscrow

// TODO change to uniIOTX?
The VotingEscrow contracts allow users to escrow their $IOTX tokens in an veIOTX NFT. 
The (ERC-721 compliant) NFT has a balance which represents the voting weight of the
escrowed tokens, which decays linearly over time. Tokens can be locked for a maximum
of four years. veIOTX NFT vote weights can be used to vote for IoTeX ecosystem protocols, 
which in turn determines the proportion of weekly emissions that go to each protocol.
VotingEscrow's clock mode is timestamps (see EIP-6372). Metadata updates (EIP-4906) are also supported. 

There are three states that veIOTX NFTs can be in: `NORMAL`, `LOCKED`, `MANAGED`.
`NORMAL` NFTs are the NFTs that users are familiar with. `Managed` NFTs are a new
type of NFT (see below). When a user deposits a normal NFT into a managed NFT, it
becomes a `LOCKED` NFT. `NORMAL` NFTs are not restricted in functionality whereas
`LOCKED` NFTs have extremely restricted functionality and `MANAGED` NFTs have
limited functionality. Managed NFT deposits and withdrawals are handled by `Voter`.

Normal NFTs can also be in a new state that is known as a permanent lock. While 
permanently locked, normal NFTs will have voting power that will be equal to the
amount of veIOTX that was locked to create it. The NFT's voting power will also
not decay. Permanent locks can be unlocked as long as you have not voted that epoch. 
Managed NFTs are permanent locks by default.

Standard Operations:
All of these operations require ownership of the underlying NFT or tokens being escrowed. 
- Can create a NFT by escrowing $IOTX tokens and "locking" them for a time period.
- Can do anything with the NFT as supported by the ERC-721 interface (requires normal or managed NFT).
- Can merge one NFT into another (requires normal NFT for `from`, but can be normal permanent for `to`).
- Can split a single NFT into two new NFTs (requires normal or normal permanent NFT).  The NFT to be split is burned.  
    - By permissioning split to an address, any normal NFTs owned by the address are able to be split.
    - Split is initially permissioned by address and can be toggled on/off (requires team).
    - In addition, there are split toggle on/off permissions protocol-wide (requires team)
- Can withdraw escrowed $IOTX tokens once the NFT lock expires (requires normal NFT). 
- Can add to an existing NFT position by escrowing additional $IOTX tokens (requires normal or normal permanent or managed NFT).
- Can increase the lock duration of an NFT (and thus increasing voting power, requires normal NFT).
- Can permanent lock a NFT to lock its voting power at the maximum and prevent decay (requires normal NFT).
- Can unlock a permanently locked NFT to allow its voting power to decay (requires normal permanent NFT).
- Can delegate votes to other `tokenId`s for use in marshall governance to other addresses based on voting power (requires normal permanent or managed NFT). Voting power retrieved from `getVotes` and `getPastVotes` does not reveal locked amount balances and are used only for voting. 

In addition, Marshall DAO supports "managed NFTs" (also known as an "(m)veNFT") which aggregates NFT voting power whilst perpetually locking the underlying tokens. These NFTs function as a single NFT, with rewards accrued by the NFT going to the manager, who can then distribute (net of fees) to the depositors. These NFTs are permanently locked by default.

- NFTs can exist in one of three states: normal, locked or managed. By default, they are in normal state.
- Only governance or an allowed manager can create managed NFTs, special NFTs in the managed state.
- Managed NFTs can be deactivated, a process which prevents the NFT from voting and from receiving deposits (requires emergency council).
- An NFT can deposit into one managed NFT at a time, converting it from normal state to locked state.
- The deposited NFT can be withdrawn at any time, with its balance restored and locktime extended to the maximum (4 years). Any rebases collected by the manager will be distributed pro-rata to the user.

## RewardsDistributor

Standard Curve-fee distribution contract, modified for use with rebases. Rebases
are calculated based on the locked and unlocked IOTX one second prior to epoch flip.
veNFTs will earn rebases proportionally based on their contribution to the total locked IOTX.
Rebase claims against expired veNFTs will be distributed as unlocked IOTX to the owner of the veNFT.

## Protocol

### Gauge

The gauge contract is a standard rewards contract in charge of distributing emissions to LP depositors. Users that deposit LP tokens can forgo their fee reward in exchange for a proportional distribution of emissions (proportional to their share of LP deposits in the gauge). The fee rewards that the LP depositors forgo are transferred to the `FeeVotingReward` contract. 

Standard Operations:
- Can deposit LP tokens.
- Can deposit LP tokens for another receipient. 
- Can withdraw LP tokens. 
- Can get emission rewards for an account. 
- Can deposit emissions into gauge (requires `Voter`).

### Reward

The base reward contract for all reward contracts. Individual voting balance checkpoints and total supply checkpoints are created in a reward contract whenever a user votes for a pool. Checkpoints do not automatically update when voting power decays (requires `Voter.poke`). Rewards in these contracts are distributed proportionally to an NFT's voting power contribution to a pool. An NFT is distributed rewards in each epoch proportional to its voting power contribution in that epoch. 

### VotingReward

Voting rewards are rewards that accrue to users that vote for a specific pool. They can be broken down into fees and bribes.
