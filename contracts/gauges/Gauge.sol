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
  uint256 public constant TOKENLESS_PRODUCTION = 40;
  uint256 public constant BASE = 100;

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

  /// @inheritdoc IGauge
  mapping(address => uint256) public shares;
  /// @inheritdoc IGauge
  uint256 public totalShare;

  /// @inheritdoc IGauge
  mapping(address => uint256) public gainBalanceOf;
  /// @inheritdoc IGauge
  uint256 public totalGainBalance;

  constructor(address _forwarder, address _stakingToken, address _voter) ERC2771Context(_forwarder) {
    stakingToken = _stakingToken;
    voter = _voter;
    shareFactor = 10;
  }

  /// @inheritdoc IGauge
  function rewardPerToken() public view returns (uint256) {
    if (totalSupply == 0) {
      return rewardPerTokenStored;
    }
    uint256 _escape = lastTimeRewardApplicable() - lastUpdateTime;
    if (_escape == 0){
      return rewardPerTokenStored;
    }
    return rewardPerTokenStored + _escape * rewardRate * PRECISION / totalGainBalance;
  }

  function updateShare(address _user, uint256 _share) external {
    if (msg.sender != voter) revert NotVoter();
    uint256 _oldShare = shares[_user];
    shares[_user] = _share;
    totalShare = totalShare - _oldShare + _share;
    _updateRewards(_user);
    updateGainBalance(_user);
  }

  /// @inheritdoc IGauge
  function lastTimeRewardApplicable() public view returns (uint256) {
    return Math.min(block.timestamp, periodFinish);
  }

  /// @inheritdoc IGauge
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

  /// @inheritdoc IGauge
  function earned(address _account) public view returns (uint256) {
    return
      (gainBalanceOf[_account] * (rewardPerToken() - userRewardPerTokenPaid[_account])) / PRECISION + rewards[_account];
  }

  function updateGainBalance(address _account) internal {
    uint256 _share = shares[_account];
    uint256 _originBalance = balanceOf[_account];
    uint256 _gainBalance = _originBalance * TOKENLESS_PRODUCTION / BASE;
    if ( _originBalance > 0 && _share > 0 ){
      _gainBalance += totalSupply * _share / totalShare *(BASE - TOKENLESS_PRODUCTION) / BASE;
    }
    _gainBalance = Math.min(_gainBalance, _originBalance);
    uint256 _oldGainbalance = gainBalanceOf[_account];
    gainBalanceOf[_account] = _gainBalance;
    totalGainBalance = totalGainBalance + _gainBalance - _oldGainbalance;
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
    updateGainBalance(_user);

    emit Deposit(sender, _recipient, _amount);
  }

  /// @inheritdoc IGauge
  function withdraw(uint256 _amount) external nonReentrant {
    address sender = _msgSender();
    _withdraw(sender, _amount);
  }

  function withdraw(address receipt, uint256 _amount) external nonReentrant {
    address _sender = msg.sender;
    if (_sender != voter) revert NotVoter();
    _withdraw(receipt, _amount);
  }

  function _withdraw(address receipt, uint256 _amount) internal {
    _updateRewards(receipt);

    totalSupply -= _amount;
    balanceOf[receipt] -= _amount;
    IERC20(stakingToken).safeTransfer(receipt, _amount);
    updateGainBalance(receipt);

    emit Withdraw(receipt, _amount);
  }

  function _updateRewards(address _user) internal {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = lastTimeRewardApplicable();
    rewards[_user] = earned(_user);
    userRewardPerTokenPaid[_user] = rewardPerTokenStored;
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
