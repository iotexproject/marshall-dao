// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IGauge.sol";

interface IRewardGauge is IGauge {
  error NotAlive();
  error NotAuthorized();
  error NotVoter();
  error NotTeam();
  error RewardRateTooHigh();
  error ZeroAmount();
  error ZeroRewardRate();

  event NotifyReward(address indexed from, uint256 amount);
  event ClaimRewards(address indexed from, uint256 amount);

  /// @notice Address of the pool LP token which is deposited (staked) for rewards
  function stakingToken() external view returns (address);

  /// @notice Address of Protocol Voter
  function voter() external view returns (address);

  /// @notice Timestamp end of current rewards period
  function periodFinish() external view returns (uint256);

  /// @notice Current reward rate of rewardToken to distribute per second
  function rewardRate() external view returns (uint256);

  /// @notice Most recent timestamp contract has updated state
  function lastUpdateTime() external view returns (uint256);

  /// @notice Most recent stored value of rewardPerToken
  function rewardPerTokenStored() external view returns (uint256);

  /// @notice Amount of stakingToken deposited for rewards
  function totalSupply() external view returns (uint256);

  /// @notice Get the amount of stakingToken deposited by an account
  function balanceOf(address) external view returns (uint256);

  /// @notice Get the address of incentive
  function incentive() external view returns (address);

  /// @notice The weighted balance is obtained and used in the calculation of rewards.
  function weightedBalanceOf(address) external view returns (uint256);

  /// @notice The weighted amount for the gauge
  function totalWeightedBalance() external view returns (uint256);

  /// @notice Total shares which has been voted to the gauge
  function totalShare() external view returns (uint256);

  /// @notice Amount of share which user voted to the gauge
  function shares(address) external view returns (uint256);

  /// @notice Cached rewardPerTokenStored for an account based on their most recent action
  function userRewardPerTokenPaid(address) external view returns (uint256);

  /// @notice Cached amount of rewardToken earned for an account
  function rewards(address) external view returns (uint256);

  /// @notice View to see the rewardRate given the timestamp of the start of the epoch
  function rewardRateByEpoch(uint256) external view returns (uint256);

  /// @notice Get the current reward rate per unit of stakingToken deposited
  function rewardPerToken() external view returns (uint256 _rewardPerToken);

  /// @notice Returns the last time the reward was modified or periodFinish if the reward has ended
  function lastTimeRewardApplicable() external view returns (uint256 _time);

  /// @notice Returns accrued balance to date from last claim / first deposit.
  function earned(address _account) external view returns (uint256 _earned);

  /// @notice Retrieve rewards for an address.
  /// @dev Throws if not called by same address or voter.
  /// @param _account .
  function claimReward(address _account) external;

  /// @notice Deposit LP tokens into gauge for msg.sender
  /// @param _amount .
  function deposit(uint256 _amount) external;

  /// @notice Deposit LP tokens into gauge for any user
  /// @param _amount .
  /// @param _recipient Recipient to give balance to
  function deposit(uint256 _amount, address _recipient) external;

  /// @notice Withdraw LP tokens for user
  /// @param _amount .
  function withdraw(uint256 _amount) external;

  /// @dev deposit vote into gauge to gain user rewards.
  /// @param _user which vote to gauge with share
  /// @param _share amount of share to deposit in gauge
  function updateShare(address _user, uint256 _share) external;
}
