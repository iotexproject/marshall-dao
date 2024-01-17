// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVoter} from "./IVoter.sol";
import {IVotingEscrow} from "./IVotingEscrow.sol";
import {IRewardsDistributor} from "./IRewardsDistributor.sol";

interface IMinter {
  error NotTeam();
  error ZeroAddress();
  error ZeroDonation();
  error InvalidRate();
  error NotPendingTeam();
  error InsufficientFund();

  event Mint(address indexed sender, uint256 weekly);
  event AcceptTeam(address indexed _newTeam);
  event WeeklyChanged(uint256 weekly);
  event VeRateChanged(uint256 rate);
  event Donation(address indexed donor, uint256 amount);

  /// @notice Interface of Voter.sol
  function voter() external view returns (IVoter);

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

  /// @notice Current team address in charge of emissions
  function team() external view returns (address);

  /// @notice Possible team address pending approval of current team
  function pendingTeam() external view returns (address);

  /// @notice Creates a request to change the current team's address
  /// @param _team Address of the new team to be chosen
  function setTeam(address _team) external;

  /// @notice Accepts the request to replace the current team's address
  ///         with the requested one, present on variable pendingTeam
  function acceptTeam() external;

  /// @notice Processes emissions and rebases. Callable once per epoch (1 week).
  /// @return _period Start of current epoch.
  function updatePeriod() external returns (uint256 _period);

  /// @notice Change weekly emission.
  function changeWeekly(uint256 _weekly) external;

  /// @notice Change ve rate of emission.
  function changeVeRate(uint256 _rate) external;

  /// @notice Donate fund to DAO
  function donate() external payable;
}
