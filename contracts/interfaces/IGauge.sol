// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGauge {

  /// @notice Total amount of rewardToken to distribute for the current rewards period
  function left() external view returns (uint256 _left);

  /// @dev Notifies gauge of gauge rewards. Assumes gauge reward tokens is 18 decimals.
  ///      If not 18 decimals, rewardRate may have rounding issues.
  function notifyRewardAmount() external payable;

  /// @dev Notifies gauge of gauge rewards without distributing its fees.
  ///      Assumes gauge reward tokens is 18 decimals.
  ///      If not 18 decimals, rewardRate may have rounding issues.
  function notifyRewardWithoutClaim() external payable;
}
