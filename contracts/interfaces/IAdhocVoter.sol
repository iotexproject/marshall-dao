// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVoter} from "./IVoter.sol";

interface IAdhocVoter {
  event Emission(address indexed sender, uint256 weekly);
  event WeeklyChanged(uint256 weekly);
  event WeightChanged(address gauge, uint256 weight);
  event GovernorChanged(address indexed governor);
  event Donation(address indexed donor, address indexed token, uint256 amount);
  event Withdraw(address indexed operator, address indexed token, address indexed recipcient, uint256 amount);
  event WhitelistToken(address indexed whitelister, address indexed token, bool indexed _bool);

  /// @notice Standard OZ IGovernor using ve for vote weights.
  function governor() external view returns (address);

  /// @notice Duration of epoch in seconds
  function WEEK() external view returns (uint256);

  /// @notice Weekly emission of IOTX
  function weekly() external view returns (uint256);

  /// @notice Timestamp of start of epoch that updatePeriod was last called in
  function activePeriod() external view returns (uint256);

  /// @notice Number of epochs in which updatePeriod was called
  function epochCount() external view returns (uint256);

  /// @dev Gauge => Liveness status
  function isAlive(address gauge) external view returns (bool);

  /// @notice Processes emissions and rebases. Callable once per epoch (1 week).
  /// @return _period Start of current epoch.
  function emitReward() external returns (uint256 _period);

  /// @notice Change weekly emission.
  function changeWeekly(uint256 _weekly) external;

  /// @notice Withdraw fund from DAO
  function withdraw(address _token, address payable _recipcient, uint256 _amount) external;

  /// @notice Set new governor.
  /// @dev Throws if not called by governor.
  /// @param _governor .
  function setGovernor(address _governor) external;

  /// @notice Donate native fund to DAO
  function donate() external payable;

  /// @notice Add new gauge;
  /// @param _gauge .
  /// @param _incentive .
  /// @param _weight for _gauge
  function addGauge(address _gauge, address _incentive, uint256 _weight) external;

  /// @notice change weight of the gauge
  /// @param _gauge .
  /// @param _weight for _gauge
  function changeWeight(address _gauge, uint256 _weight) external;
}
