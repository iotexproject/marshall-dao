// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IReward} from "../interfaces/IReward.sol";
import {IVoter} from "../interfaces/IVoter.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ProtocolTimeLibrary} from "../libraries/ProtocolTimeLibrary.sol";

/// @title Reward
/// @author velodrome.finance, @figs999, @pegahcarter
/// @notice Base reward contract for distribution of rewards
abstract contract Reward is IReward, ERC2771Context, ReentrancyGuard {
  using SafeERC20 for IERC20;

  /// @inheritdoc IReward
  uint256 public constant DURATION = 7 days;

  /// @inheritdoc IReward
  address public immutable voter;
  /// @inheritdoc IReward
  address public authorized;

  /// @inheritdoc IReward
  uint256 public totalSupply;
  /// @inheritdoc IReward
  mapping(address => uint256) public balanceOf;
  /// @inheritdoc IReward
  mapping(address => mapping(uint256 => uint256)) public tokenRewardsPerEpoch;
  /// @inheritdoc IReward
  mapping(address => mapping(address => uint256)) public lastEarn;

  address[] public rewards;
  /// @inheritdoc IReward
  mapping(address => bool) public isReward;

  /// @notice A record of balance checkpoints for each account, by index
  mapping(address => mapping(uint256 => Checkpoint)) public checkpoints;
  /// @inheritdoc IReward
  mapping(address => uint256) public numCheckpoints;
  /// @notice A record of balance checkpoints for each token, by index
  mapping(uint256 => SupplyCheckpoint) public supplyCheckpoints;
  /// @inheritdoc IReward
  uint256 public supplyNumCheckpoints;

  /// @inheritdoc IReward
  address public gauge;

  constructor(address _forwarder, address _voter) ERC2771Context(_forwarder) {
    voter = _voter;
  }

  function setGauge(address _gauge) external {
    require(gauge == address (0), "gauge has been set");
    if (msg.sender != authorized) revert NotAuthorized();

    gauge = _gauge;
  }

  /// @inheritdoc IReward
  function getPriorBalanceIndex(address receiver, uint256 timestamp) public view returns (uint256) {
    uint256 nCheckpoints = numCheckpoints[receiver];
    if (nCheckpoints == 0) {
      return 0;
    }

    // First check most recent balance
    if (checkpoints[receiver][nCheckpoints - 1].timestamp <= timestamp) {
      return (nCheckpoints - 1);
    }

    // Next check implicit zero balance
    if (checkpoints[receiver][0].timestamp > timestamp) {
      return 0;
    }

    uint256 lower = 0;
    uint256 upper = nCheckpoints - 1;
    while (upper > lower) {
      uint256 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
      Checkpoint memory cp = checkpoints[receiver][center];
      if (cp.timestamp == timestamp) {
        return center;
      } else if (cp.timestamp < timestamp) {
        lower = center;
      } else {
        upper = center - 1;
      }
    }
    return lower;
  }

  /// @inheritdoc IReward
  function getPriorSupplyIndex(uint256 timestamp) public view returns (uint256) {
    uint256 nCheckpoints = supplyNumCheckpoints;
    if (nCheckpoints == 0) {
      return 0;
    }

    // First check most recent balance
    if (supplyCheckpoints[nCheckpoints - 1].timestamp <= timestamp) {
      return (nCheckpoints - 1);
    }

    // Next check implicit zero balance
    if (supplyCheckpoints[0].timestamp > timestamp) {
      return 0;
    }

    uint256 lower = 0;
    uint256 upper = nCheckpoints - 1;
    while (upper > lower) {
      uint256 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
      SupplyCheckpoint memory cp = supplyCheckpoints[center];
      if (cp.timestamp == timestamp) {
        return center;
      } else if (cp.timestamp < timestamp) {
        lower = center;
      } else {
        upper = center - 1;
      }
    }
    return lower;
  }

  function _writeCheckpoint(address _user, uint256 balance) internal {
    uint256 _nCheckPoints = numCheckpoints[_user];
    uint256 _timestamp = block.timestamp;

    if (
      _nCheckPoints > 0 &&
      ProtocolTimeLibrary.epochStart(checkpoints[_user][_nCheckPoints - 1].timestamp) ==
      ProtocolTimeLibrary.epochStart(_timestamp)
    ) {
      checkpoints[_user][_nCheckPoints - 1] = Checkpoint(_timestamp, balance);
    } else {
      checkpoints[_user][_nCheckPoints] = Checkpoint(_timestamp, balance);
      numCheckpoints[_user] = _nCheckPoints + 1;
    }
  }

  function _writeSupplyCheckpoint() internal {
    uint256 _nCheckPoints = supplyNumCheckpoints;
    uint256 _timestamp = block.timestamp;

    if (
      _nCheckPoints > 0 &&
      ProtocolTimeLibrary.epochStart(supplyCheckpoints[_nCheckPoints - 1].timestamp) ==
      ProtocolTimeLibrary.epochStart(_timestamp)
    ) {
      supplyCheckpoints[_nCheckPoints - 1] = SupplyCheckpoint(_timestamp, totalSupply);
    } else {
      supplyCheckpoints[_nCheckPoints] = SupplyCheckpoint(_timestamp, totalSupply);
      supplyNumCheckpoints = _nCheckPoints + 1;
    }
  }

  /// @inheritdoc IReward
  function rewardsListLength() external view returns (uint256) {
    return rewards.length;
  }

  function rewardTokens() external view returns (address[] memory) {
    return rewards;
  }

  /// @inheritdoc IReward
  function earned(address token, address receiver) public view returns (uint256) {
    if (numCheckpoints[receiver] == 0) {
      return 0;
    }

    uint256 reward = 0;
    uint256 _supply = 1;
    uint256 _currTs = ProtocolTimeLibrary.epochStart(lastEarn[token][receiver]); // take epoch last claimed in as starting point
    uint256 _index = getPriorBalanceIndex(receiver, _currTs);
    Checkpoint memory cp0 = checkpoints[receiver][_index];

    // accounts for case where lastEarn is before first checkpoint
    _currTs = Math.max(_currTs, ProtocolTimeLibrary.epochStart(cp0.timestamp));

    // get epochs between current epoch and first checkpoint in same epoch as last claim
    uint256 numEpochs = (ProtocolTimeLibrary.epochStart(block.timestamp) - _currTs) / DURATION;

    if (numEpochs > 0) {
      for (uint256 i = 0; i < numEpochs; i++) {
        // get index of last checkpoint in this epoch
        _index = getPriorBalanceIndex(receiver, _currTs + DURATION - 1);
        // get checkpoint in this epoch
        cp0 = checkpoints[receiver][_index];
        // get supply of last checkpoint in this epoch
        _supply = Math.max(supplyCheckpoints[getPriorSupplyIndex(_currTs + DURATION - 1)].supply, 1);
        reward += (cp0.balanceOf * tokenRewardsPerEpoch[token][_currTs]) / _supply;
        _currTs += DURATION;
      }
    }

    return reward;
  }

  /// @inheritdoc IReward
  function _deposit(uint256 amount, address receiver) external {
    address sender = _msgSender();
    if (sender != gauge) revert NotGauge();

    totalSupply += amount;
    balanceOf[receiver] += amount;

    _writeCheckpoint(receiver, balanceOf[receiver]);
    _writeSupplyCheckpoint();

    emit Deposit(sender, receiver, amount);
  }

  /// @inheritdoc IReward
  function _withdraw(uint256 amount, address receiver) external {
    address sender = _msgSender();
    if (sender != gauge) revert NotGauge();

    totalSupply -= amount;
    balanceOf[receiver] -= amount;

    _writeCheckpoint(receiver, balanceOf[receiver]);
    _writeSupplyCheckpoint();

    emit Withdraw(sender, receiver, amount);
  }

  /// @inheritdoc IReward
  function claimReward(address[] memory tokens) external virtual nonReentrant {}

  /// @dev used with all getReward implementations
  function _claimReward(address recipient, address[] memory tokens) internal {
    uint256 _length = tokens.length;
    for (uint256 i = 0; i < _length; i++) {
      uint256 _reward = earned(tokens[i], recipient);
      lastEarn[tokens[i]][recipient] = block.timestamp;
      if (_reward > 0) IERC20(tokens[i]).safeTransfer(recipient, _reward);

      emit ClaimRewards(recipient, tokens[i], _reward);
    }
  }

  /// @inheritdoc IReward
  function notifyRewardAmount(address token, uint256 amount) external virtual nonReentrant {}

  /// @dev used within all notifyRewardAmount implementations
  function _notifyRewardAmount(address sender, address token, uint256 amount) internal {
    if (amount == 0) revert ZeroAmount();
    IERC20(token).safeTransferFrom(sender, address(this), amount);

    uint256 epochStart = ProtocolTimeLibrary.epochStart(block.timestamp);
    tokenRewardsPerEpoch[token][epochStart] += amount;

    emit NotifyReward(sender, token, epochStart, amount);
  }

  /// @dev add new reward token to incentive.
  function addRewardToken(address token) external {
    if (!isReward[token]) {
      if (!IVoter(voter).isWhitelistedToken(token)) revert NotWhitelisted();
      isReward[token] = true;
      rewards.push(token);
    }
  }
}
