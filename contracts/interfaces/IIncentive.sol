// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIncentive {
  error NotGauge();
  error NotWhitelisted();
  error ZeroAmount();
  error NotVoter();
  error RewardTokenExist();
  error ZeroRewardRate();
  error RewardRateTooHigh();
  error NotRewardToken();

  event DepositLP(address indexed from, address indexed receiver, uint256 amount);
  event WithdrawLP(address indexed from, address indexed receiver, uint256 amount);
  event NotifyReward(address indexed from, address indexed reward, uint256 indexed epoch, uint256 amount);
  event ClaimRewards(address indexed receipt, address indexed token, uint256 amount);

  /// @notice Address of Voter.sol
  function voter() external view returns (address);

  /// @notice Total amount currently deposited via _deposit()
  function totalSupply() external view returns (uint256);

  /// @notice Current amount deposited by tokenId
  function balanceOf(address _user) external view returns (uint256);

  /// @notice Amount of tokens to reward depositors for a given epoch
  /// @param epochStart Startime of rewards epoch
  /// @param token Address of token to reward
  /// @return Amount of token
  function rewardRateByEpoch(uint256 epochStart, address token) external view returns (uint256);

  /// @notice True if a token is or has been an active reward token, else false
  function isReward(address token) external view returns (bool);

  /// @notice Get number of rewards tokens
  function rewardsListLength() external view returns (uint256);

  /// @notice Get reward tokens
  function rewardAllTokens() external view returns (address[] memory);

  /// @notice Timestamp end of current rewards period
  function periodFinish(address token) external view returns (uint256);

  /// @notice Current reward rate of rewardToken to distribute per second
  function rewardRate(address token) external view returns (uint256);

  /// @notice Most recent timestamp contract has updated state
  function lastUpdateTime(address token) external view returns (uint256);

  /// @notice Gauge associated with the incentive contract
  function gauge() external view returns (address);

  /// @notice limit num of reward tokens
  function limitTokenNum() external view returns (uint256);

  /// @notice Get the current reward rate per unit of lp(in the Gauge) deposited
  function rewardPerToken(address token) external view returns (uint256);

  /// @notice Returns the last time the reward was modified or periodFinish if the reward has ended
  function lastTimeRewardApplicable(address token) external view returns (uint256);

  /// @notice Reward rate of the rewardToken for LP
  function rewardPerTokenStored(address rewardToken) external view returns (uint256);

  /// @notice Cached amount of rewardToken earned for an account and token
  /// @param _user Which will be query
  /// @param _token Will get the reward of the token
  function rewards(address _user, address _token) external view returns (uint256);

  /// @notice Cached rewardPerTokenStored for an account based on their most recent action
  /// @param _user Which will be query
  /// @param _token The reward token
  function userRewardPerTokenPaid(address _user, address _token) external view returns (uint256);

  ///
  function setGauge(address _gauge) external;

  /// @notice Record an amount of LP into the rewards contract to earn more rewards.
  /// @dev Internal notation used as only callable internally by `Gauge`.
  /// @param amount Amount of LP which is deposited in gauge.
  /// @param user  Who deposit LP to gauge
  function deposit(uint256 amount, address user) external;

  /// @notice Withdraw an amount from the rewards contract.
  /// @dev Internal notation used as only callable internally by `Gauge`.
  /// @param amount Amount of LP which is withdraw in gauge.
  /// @param receiver Who withdraw LP from gauge
  function withdraw(uint256 amount, address receiver) external;

  /// @notice Claim the rewards earned by Lp
  /// @param tokens   Array of tokens to claim rewards of
  function claimReward(address[] memory tokens) external;

  /// @notice The rest of the reward money to the token.
  /// @param token Which will be query
  function left(address token) external view returns (uint256);

  /// @notice Add rewards for stakers to earn
  /// @param token    Address of token to reward
  /// @param amount   Amount of token to transfer to rewards
  function notifyRewardAmount(address token, uint256 amount) external;

  /// @notice Calculate how much in rewards are earned for a specific token
  /// @param token Address of token to fetch rewards of
  /// @param _user will receive reward
  /// @return Amount of token earned in rewards
  function earned(address token, address _user) external view returns (uint256);
}
