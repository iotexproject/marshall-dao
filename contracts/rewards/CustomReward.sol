// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Reward} from "./Reward.sol";

/// @title Base voting reward contract for distribution of rewards by token id
///        on a weekly basis
abstract contract CustomReward is Reward {
  constructor(address _forwarder, address _voter, address[] memory _rewards) Reward(_forwarder, _voter) {
    uint256 _length = _rewards.length;
    for (uint256 i; i < _length; i++) {
      if (_rewards[i] != address(0)) {
        isReward[_rewards[i]] = true;
        rewards.push(_rewards[i]);
      }
    }

    authorized = _voter;
  }

  /// @inheritdoc Reward
  function getReward(address[] memory tokens) external override nonReentrant {
    address sender = _msgSender();
    _getReward(sender, tokens);
  }

  /// @inheritdoc Reward
  function getReward(address receiver, address[] memory tokens) external override nonReentrant {
    address sender = _msgSender();
    if (sender != voter) revert NotAuthorized();

    _getReward(receiver, tokens);
  }

  /// @inheritdoc Reward
  function notifyRewardAmount(address token, uint256 amount) external virtual override {}
}
