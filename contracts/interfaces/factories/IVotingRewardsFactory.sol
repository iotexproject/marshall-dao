// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVotingRewardsFactory {
  /// @notice creates a BribeVotingReward contract for a gauge
  /// @param _forwarder            Address of trusted forwarder
  /// @param _pool                 Addresse of pool
  /// @return bribeVotingReward   Address of BribeVotingReward contract created
  function createRewards(address _forwarder, address _pool) external returns (address bribeVotingReward);
}
