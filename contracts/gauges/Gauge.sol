// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IGauge} from "../interfaces/IGauge.sol";
import {IVoter} from "../interfaces/IVoter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ProtocolTimeLibrary} from "../libraries/ProtocolTimeLibrary.sol";
import {IStrategyManager} from "../interfaces/IStrategyManager.sol";

/// @title Protocol Gauge
/// @author veldorome.finance, @figs999, @pegahcarter
/// @notice Gauge contract for distribution of emissions by address
contract Gauge is IGauge, ERC2771Context, ReentrancyGuard {
  using SafeERC20 for IERC20;
  /// @inheritdoc IGauge
  address public immutable stakingToken;
  /// @inheritdoc IGauge
  address public immutable voter;

  uint256 internal constant DURATION = 7 days; // rewards are released over 7 days
  uint256 internal constant PRECISION = 10 ** 18;

  /// @inheritdoc IGauge
  uint256 public periodFinish;
  /// @inheritdoc IGauge
  uint256 public rewardRate;
  /// @inheritdoc IGauge
  uint256 public lastUpdateTime;
  /// @inheritdoc IGauge
  uint256 public rewardPerTokenStored;
  /// @inheritdoc IGauge
  uint256 public totalSupply;
  /// @inheritdoc IGauge
  mapping(address => uint256) public balanceOf;
  /// @inheritdoc IGauge
  mapping(address => uint256) public userRewardPerTokenPaid;
  /// @inheritdoc IGauge
  mapping(address => uint256) public rewards;
  /// @inheritdoc IGauge
  mapping(uint256 => uint256) public rewardRateByEpoch;

  constructor(address _forwarder, address _stakingToken, address _voter) ERC2771Context(_forwarder) {
    stakingToken = _stakingToken;
    voter = _voter;
  }

  /// @inheritdoc IGauge
  function rewardPerToken() public view returns (uint256) {
    if (totalSupply == 0) {
      return rewardPerTokenStored;
    }
    return
      rewardPerTokenStored + ((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * PRECISION) / totalSupply;
  }

  /// @inheritdoc IGauge
  function lastTimeRewardApplicable() public view returns (uint256) {
    return Math.min(block.timestamp, periodFinish);
  }

  /// @inheritdoc IGauge
  function getReward(address _account) external nonReentrant {
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

  /// @inheritdoc IGauge
  function earned(address _account) public view returns (uint256) {
    return
      (balanceOf[_account] * (rewardPerToken() - userRewardPerTokenPaid[_account])) / PRECISION + rewards[_account];
  }

  /// @inheritdoc IGauge
  function deposit(uint256 _amount) external {
    _depositFor(_amount, _msgSender());
  }

  /// @inheritdoc IGauge
  function deposit(uint256 _amount, address _recipient) external {
    _depositFor(_amount, _recipient);
  }

  function _depositFor(uint256 _amount, address _recipient) internal nonReentrant {
    if (_amount == 0) revert ZeroAmount();
    if (!IVoter(voter).isAlive(address(this))) revert NotAlive();

    address sender = _msgSender();
    _updateRewards(_recipient);

    IERC20(stakingToken).safeTransferFrom(sender, address(this), _amount);
    totalSupply += _amount;
    balanceOf[_recipient] += _amount;

    emit Deposit(sender, _recipient, _amount);
  }

  /// @inheritdoc IGauge
  function withdraw(uint256 _amount) external nonReentrant {
    address sender = _msgSender();

    _updateRewards(sender);

    totalSupply -= _amount;
    balanceOf[sender] -= _amount;
    IERC20(stakingToken).safeTransfer(sender, _amount);

    emit Withdraw(sender, _amount);
  }

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
