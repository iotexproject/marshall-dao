// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVoter} from "../interfaces/IVoter.sol";
import {CustomReward} from "./CustomReward.sol";

/// @notice Bribes pay out rewards for a given pool based on the votes that were received from the user (goes hand in hand with Voter.vote())
contract Incentive is CustomReward {
  constructor(
    address _forwarder,
    address _voter,
    address[] memory _rewards
  ) CustomReward(_forwarder, _voter, _rewards) {}

  /// @inheritdoc CustomReward
  function notifyRewardAmount(address token, uint256 amount) external override nonReentrant {
    address sender = _msgSender();
    if (!isReward[token]) revert NotRewardToken();
    _notifyRewardAmount(sender, token, amount);
  }
}
