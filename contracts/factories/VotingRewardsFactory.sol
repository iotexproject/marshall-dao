// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVotingRewardsFactory} from "../interfaces/factories/IVotingRewardsFactory.sol";
import {BribeVotingReward} from "../rewards/BribeVotingReward.sol";

contract VotingRewardsFactory is IVotingRewardsFactory {
  /// @inheritdoc IVotingRewardsFactory
  function createRewards(address _forwarder, address _pool) external returns (address bribeVotingReward) {
    address[] memory rewards = new address[](1);
    rewards[0] = _pool;
    bribeVotingReward = address(new BribeVotingReward(_forwarder, msg.sender, rewards));
  }
}
