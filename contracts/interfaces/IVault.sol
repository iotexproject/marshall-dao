// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVoter} from "./IVoter.sol";
import {IVotingEscrow} from "./IVotingEscrow.sol";
import {IRewardsDistributor} from "./IRewardsDistributor.sol";

interface IVault {
  error NotGovernor();
  error ZeroAddress();
  error ZeroDonation();
  error InvalidRate();
  error InsufficientFund();

  event Emission(address indexed sender, uint256 weekly);
  event WeeklyChanged(uint256 weekly);
  event VeRateChanged(uint256 rate);
  event Donation(address indexed donor, address indexed token, uint256 amount);
  event Withdraw(address indexed operator, address indexed token, address indexed recipcient, uint256 amount);

  /// @notice Interface of Voter.sol
  function voter() external view returns (IVoter);

  /// @notice Standard OZ IGovernor using ve for vote weights.
  function governor() external view returns (address);

  /// @notice Interface of IVotingEscrow.sol
  function ve() external view returns (IVotingEscrow);

  /// @notice Interface of RewardsDistributor.sol
  function rewardsDistributor() external view returns (IRewardsDistributor);

  /// @notice Duration of epoch in seconds
  function WEEK() external view returns (uint256);

  /// @notice Weekly emission of IOTX
  function weekly() external view returns (uint256);

  /// @notice VotingEscrow holder rate
  function veRate() external view returns (uint256);

  /// @notice Timestamp of start of epoch that updatePeriod was last called in
  function activePeriod() external view returns (uint256);

  /// @notice Number of epochs in which updatePeriod was called
  function epochCount() external view returns (uint256);

  /// @notice Processes emissions and rebases. Callable once per epoch (1 week).
  /// @return _period Start of current epoch.
  function updatePeriod() external returns (uint256 _period);

  /// @notice Change weekly emission.
  function changeWeekly(uint256 _weekly) external;

  /// @notice Change ve rate of emission.
  function changeVeRate(uint256 _rate) external;

  /// @notice Withdraw fund from DAO
  function withdraw(address _token, address payable _recipcient, uint256 _amount) external;

  /// @notice Set new governor.
  /// @dev Throws if not called by governor.
  /// @param _governor .
  function setGovernor(address _governor) external;

  /// @notice Donate native fund to DAO
  function donate() external payable;

  /// @notice Donate ERC20 fund to DAO
  function donate(address _token, uint256 _amount) external;
}
