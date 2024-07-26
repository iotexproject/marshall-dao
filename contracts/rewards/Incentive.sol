// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IVoter} from "../interfaces/IVoter.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ProtocolTimeLibrary} from "../libraries/ProtocolTimeLibrary.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IIncentive} from "../interfaces/IIncentive.sol";

/// @title Protocol Gauge
/// @author veldorome.finance, @figs999, @pegahcarter
/// @notice Gauge contract for distribution of emissions by address
contract Incentives is IIncentive, ERC2771Context, ReentrancyGuard {
  using SafeERC20 for IERC20;

  /// @inheritdoc IIncentive
  address public immutable voter;

  uint256 internal constant DURATION = 7 days; // rewards are released over 7 days
  uint256 internal constant PRECISION = 10 ** 18;

  /// @inheritdoc IIncentive
  mapping(address => uint256) public periodFinish;
  /// @inheritdoc IIncentive
  mapping(address => uint256) public rewardRate;
  /// @inheritdoc IIncentive
  mapping(address => uint256) public lastUpdateTime;
  /// @inheritdoc IIncentive
  // token => reward
  mapping(address => uint256) public rewardPerTokenStored;
  /// @inheritdoc IIncentive
  uint256 public totalSupply;
  /// @inheritdoc IIncentive
  mapping(address => uint256) public balanceOf;
  /// @inheritdoc IIncentive
  mapping(address => mapping(address => uint256)) public userRewardPerTokenPaid;
  /// @inheritdoc IIncentive
  mapping(address => mapping(address => uint256)) public rewards;
  /// @inheritdoc IIncentive
  mapping(uint256 => mapping(address => uint256)) public rewardRateByEpoch;

  /// @inheritdoc IIncentive
  address public gauge;
  /// @inheritdoc IIncentive
  uint256 public limitTokenNum;
  address[] public rewardTokens;
  /// @inheritdoc IIncentive
  mapping(address => bool) public isReward;

  constructor(address _forwarder, address _voter, address[] memory _rewards) ERC2771Context(_forwarder) {
    voter = _voter;
    limitTokenNum = 20;
    uint256 addNum = 0;
    uint256 _length = _rewards.length;
    for (uint256 i; i < _length; i++) {
      if (_rewards[i] != address(0)) {
        addNum += 1;
        require(addNum <= limitTokenNum, "number of reward token over limit");
        isReward[_rewards[i]] = true;
        rewardTokens.push(_rewards[i]);
      }
    }
  }

  modifier onlyGauge() {
    address _sender = msg.sender;
    if (_sender != gauge) revert NotGauge();
    _;
  }

  function addRewardToken(address token) external {
    if (isReward[token]) revert RewardTokenExist();
    if (!IVoter(voter).isWhitelistedToken(token)) revert NotWhitelisted();
    require(rewardTokens.length < limitTokenNum, "number of reward token over limit");

    isReward[token] = true;
    rewardTokens.push(token);
  }

  function setGauge(address _gauge) external {
    require(gauge == address(0), "gauge has been set");
    if (msg.sender != voter) revert NotVoter();

    gauge = _gauge;
  }

  function rewardsListLength() external view returns (uint256) {
    return rewardTokens.length;
  }

  function rewardAllTokens() external view returns (address[] memory) {
    return rewardTokens;
  }

  /// @inheritdoc IIncentive
  function deposit(uint256 _amount, address _recipient) external onlyGauge {
    if (_amount == 0) revert ZeroAmount();

    _updateRewards(_recipient);
    totalSupply += _amount;
    balanceOf[_recipient] += _amount;

    emit DepositLP(_recipient, address(this), _amount);
  }

  function withdraw(uint256 _amount, address _recipient) external onlyGauge {
    require(balanceOf[_recipient] >= _amount, "not enough amount");

    _updateRewards(_recipient);
    totalSupply -= _amount;
    balanceOf[_recipient] -= _amount;

    emit WithdrawLP(address(this), _recipient, _amount);
  }

  function _updateRewards(address _user) internal {
    address[] memory _tokens = rewardTokens;
    uint256 _length = _tokens.length;
    for (uint256 i = 0; i < _length; i++) {
      _updateTokenReward(_tokens[i], _user);
    }
  }

  function _updateTokenReward(address _token, address _user) internal {
    uint256 _reward = rewardPerToken(_token);
    rewardPerTokenStored[_token] = _reward;
    lastUpdateTime[_token] = lastTimeRewardApplicable(_token);
    rewards[_user][_token] = earned(_user, _token);
    userRewardPerTokenPaid[_user][_token] = _reward;
  }

  /// @inheritdoc IIncentive
  function rewardPerToken(address token) public view returns (uint256) {
    if (totalSupply == 0) {
      return rewardPerTokenStored[token];
    }
    uint256 _escape = lastTimeRewardApplicable(token) - lastUpdateTime[token];
    if (_escape == 0) {
      return rewardPerTokenStored[token];
    }
    return rewardPerTokenStored[token] + (_escape * rewardRate[token] * PRECISION) / totalSupply;
  }

  /// @inheritdoc IIncentive
  function lastTimeRewardApplicable(address token) public view returns (uint256) {
    return Math.min(block.timestamp, periodFinish[token]);
  }

  /// @inheritdoc IIncentive
  function earned(address _account, address _token) public view returns (uint256) {
    return
      (balanceOf[_account] * (rewardPerToken(_token) - userRewardPerTokenPaid[_account][_token])) /
      PRECISION +
      rewards[_account][_token];
  }

  /// @inheritdoc IIncentive
  function claimReward(address[] memory tokens) external nonReentrant {
    address sender = _msgSender();
    uint256 _length = tokens.length;
    for (uint256 i = 0; i < _length; i++) {
      _claimReward(tokens[i], sender);
    }
  }

  function _claimReward(address _token, address _receipt) internal {
    _updateTokenReward(_token, _receipt);
    uint256 _reward = rewards[_receipt][_token];
    if (_reward > 0) {
      rewards[_receipt][_token] = 0;
      IERC20(_token).safeTransfer(_receipt, _reward);
      emit ClaimRewards(_receipt, _token, _reward);
    }
  }

  /// @inheritdoc IIncentive
  function left(address token) external view returns (uint256) {
    if (block.timestamp >= periodFinish[token]) return 0;
    uint256 _remaining = periodFinish[token] - block.timestamp;
    return _remaining * rewardRate[token];
  }

  /// @inheritdoc IIncentive
  function notifyRewardAmount(address _token, uint256 _amount) external nonReentrant {
    address sender = _msgSender();
    if (_amount == 0) revert ZeroAmount();
    if (!isReward[_token]) revert NotRewardToken();
    _notifyRewardAmount(sender, _token, _amount);
  }

  function _notifyRewardAmount(address sender, address _token, uint256 _amount) internal {
    IERC20(_token).safeTransferFrom(sender, address(this), _amount);
    rewardPerTokenStored[_token] = rewardPerToken(_token);
    uint256 timestamp = block.timestamp;
    uint256 timeUntilNext = ProtocolTimeLibrary.epochNext(timestamp) - timestamp;

    uint256 _rewardRate;
    if (timestamp >= periodFinish[_token]) {
      _rewardRate = _amount / timeUntilNext;
    } else {
      uint256 _remaining = periodFinish[_token] - timestamp;
      uint256 _leftover = _remaining * rewardRate[_token];
      _rewardRate = (_amount + _leftover) / timeUntilNext;
    }
    if (_rewardRate == 0) revert ZeroRewardRate();
    uint256 epochStart = ProtocolTimeLibrary.epochStart(timestamp);
    rewardRate[_token] = _rewardRate;
    rewardRateByEpoch[epochStart][_token] = _rewardRate;

    // Ensure the provided reward amount is not more than the balance in the contract.
    // This keeps the reward rate in the right range, preventing overflows due to
    // very high values of rewardRate in the earned and rewardsPerToken functions;
    // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
    uint256 balance = IERC20(_token).balanceOf(address(this));
    if (_rewardRate > balance / timeUntilNext) revert RewardRateTooHigh();

    lastUpdateTime[_token] = timestamp;
    periodFinish[_token] = timestamp + timeUntilNext;
    emit NotifyReward(sender, _token, epochStart, _amount);
  }
}
