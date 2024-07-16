// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IGauge, IRewardGauge} from "../interfaces/IRewardGauge.sol";
import {IVoter} from "../interfaces/IVoter.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ProtocolTimeLibrary} from "../libraries/ProtocolTimeLibrary.sol";

/// @title Protocol Gauge
/// @author veldorome.finance, @figs999, @pegahcarter
/// @notice Gauge contract for distribution of emissions by address
abstract contract RewardGauge is IRewardGauge, ERC2771Context, ReentrancyGuard {
  /// @inheritdoc IRewardGauge
  address public immutable stakingToken;
  /// @inheritdoc IRewardGauge
  address public immutable voter;

  uint256 internal constant DURATION = 7 days; // rewards are released over 7 days
  uint256 internal constant PRECISION = 10 ** 18;

  /// @inheritdoc IRewardGauge
  uint256 public periodFinish;
  /// @inheritdoc IRewardGauge
  uint256 public rewardRate;
  /// @inheritdoc IRewardGauge
  uint256 public lastUpdateTime;
  /// @inheritdoc IRewardGauge
  uint256 public rewardPerTokenStored;
  /// @inheritdoc IRewardGauge
  uint256 public totalSupply;
  /// @inheritdoc IRewardGauge
  mapping(address => uint256) public balanceOf;
  /// @inheritdoc IRewardGauge
  mapping(address => uint256) public userRewardPerTokenPaid;
  /// @inheritdoc IRewardGauge
  mapping(address => uint256) public rewards;
  /// @inheritdoc IRewardGauge
  mapping(uint256 => uint256) public rewardRateByEpoch;

  constructor(address _forwarder, address _stakingToken, address _voter) ERC2771Context(_forwarder) {
    stakingToken = _stakingToken;
    voter = _voter;
  }

  /// @inheritdoc IRewardGauge
  function rewardPerToken() public view returns (uint256) {
    if (totalSupply == 0) {
      return rewardPerTokenStored;
    }
    return
      rewardPerTokenStored + ((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * PRECISION) / totalSupply;
  }

  /// @inheritdoc IRewardGauge
  function lastTimeRewardApplicable() public view returns (uint256) {
    return Math.min(block.timestamp, periodFinish);
  }

  /// @inheritdoc IRewardGauge
  function claimReward(address _account) external nonReentrant {
    address sender = _msgSender();
    if (sender != _account && sender != voter) revert NotAuthorized();

    _updateRewards(_account);

    uint256 reward = rewards[_account];
    if (reward > 0) {
      rewards[_account] = 0;
      (bool success, ) = payable(_account).call{value: reward}("");
      require(success, "transfer rewards failed.");
      emit ClaimRewards(_account, reward);
    }
  }

  /// @inheritdoc IRewardGauge
  function earned(address _account) public view returns (uint256) {
    return
      (balanceOf[_account] * (rewardPerToken() - userRewardPerTokenPaid[_account])) / PRECISION + rewards[_account];
  }

  /// @inheritdoc IRewardGauge
  function deposit(uint256 _amount) external {
    _depositFor(_amount, _msgSender());
  }

  /// @inheritdoc IRewardGauge
  function deposit(uint256 _amount, address _recipient) external {
    _depositFor(_amount, _recipient);
  }

  function withdraw(uint256 _amount) external virtual;

  function _depositFor(uint256 _amount, address _recipient) internal virtual;

  function _updateRewards(address _account) internal {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = lastTimeRewardApplicable();
    rewards[_account] = earned(_account);
    userRewardPerTokenPaid[_account] = rewardPerTokenStored;
  }

  /// @inheritdoc IGauge
  function left() external view returns (uint256) {
    if (block.timestamp >= periodFinish) return 0;
    uint256 _remaining = periodFinish - block.timestamp;
    return _remaining * rewardRate;
  }

  /// @inheritdoc IGauge
  function notifyRewardAmount() external payable nonReentrant {
    address sender = _msgSender();
    uint256 _amount = msg.value;
    if (sender != voter) revert NotVoter();
    if (_amount == 0) revert ZeroAmount();
    _notifyRewardAmount(sender, _amount);
  }

  /// @inheritdoc IGauge
  function notifyRewardWithoutClaim() external payable nonReentrant {
    address sender = _msgSender();
    uint256 _amount = msg.value;
    if (sender != IVoter(voter).team()) revert NotTeam();
    if (_amount == 0) revert ZeroAmount();
    _notifyRewardAmount(sender, _amount);
  }

  function _notifyRewardAmount(address sender, uint256 _amount) internal {
    rewardPerTokenStored = rewardPerToken();
    uint256 timestamp = block.timestamp;
    uint256 timeUntilNext = ProtocolTimeLibrary.epochNext(timestamp) - timestamp;

    if (timestamp >= periodFinish) {
      rewardRate = _amount / timeUntilNext;
    } else {
      uint256 _remaining = periodFinish - timestamp;
      uint256 _leftover = _remaining * rewardRate;
      rewardRate = (_amount + _leftover) / timeUntilNext;
    }
    rewardRateByEpoch[ProtocolTimeLibrary.epochStart(timestamp)] = rewardRate;
    if (rewardRate == 0) revert ZeroRewardRate();

    // Ensure the provided reward amount is not more than the balance in the contract.
    // This keeps the reward rate in the right range, preventing overflows due to
    // very high values of rewardRate in the earned and rewardsPerToken functions;
    // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
    uint256 balance = address(this).balance;
    if (rewardRate > balance / timeUntilNext) revert RewardRateTooHigh();

    lastUpdateTime = timestamp;
    periodFinish = timestamp + timeUntilNext;
    emit NotifyReward(sender, _amount);
  }
}
