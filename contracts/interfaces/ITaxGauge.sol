// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITaxGauge {
  /// @notice Total amount of rewardToken to distribute for the current rewards period
  function left() external view returns (uint256 _left);

  /// @dev Notifies gauge of gauge rewards. Assumes gauge reward tokens is 18 decimals.
  ///      If not 18 decimals, rewardRate may have rounding issues.
  function notifyRewardAmount() external payable;

  /// @notice withdraw amount of tax for taxer.
  /// @param _taxer .
  function withdrawTax(address _taxer) external;

  /// @notice update address of taxer
  /// @param _taxer .
  function changeTaxer(address _taxer) external;

  /// @notice update ratio for tax
  /// @param _ratio .
  function changeTaxRatio(uint256 _ratio) external;

  /// @notice change voter.
  /// @param _voter.
  function changeVoter(address _voter) external;
}
