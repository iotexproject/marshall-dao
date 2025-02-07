// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {MulticallUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {IWeightedNFT} from "../interfaces/IWeightedNFT.sol";
import "../interfaces/ISystemStaking.sol";

contract FixedRewardPoolV3WithStaking is
  MulticallUpgradeable,
  OwnableUpgradeable,
  ReentrancyGuardUpgradeable,
  ERC721Holder
{
  string public constant GAUGE_TYPE = "gauge_fixed_reward_pool";
  string public constant GAUGE_VERSION = "0.3.0_staking";

  event Deposit(address indexed user, uint256 bucketId, uint256 tokenId, uint256 rewards, uint256 weight);
  event Withdraw(address indexed user, uint256 tokenId, uint256 rewards, uint256 weight);
  event EmergencyWithdraw(address indexed user, uint256 tokenId, uint256 weight);
  event Poke(address indexed user, uint256 tokenId, uint256 rewards, uint256 originalWeight, uint256 newWeight);
  event ClaimRewards(address indexed user, uint256 rewards);
  event StopRewards(uint256 stopTimestamp);
  event NewRewardPerSecond(uint256 rewardPerSecond);
  event NewBonusEndTimestamp(uint256 bonusEndTimestamp);
  event UpdateSystemStakingParameters(uint256 minDuration, uint256 stakingPerDevice);

  struct UserInfo {
    uint256 amount; // How many staked tokens the user has provided
    uint256 rewardDebt; // Reward debt
  }

  // The precision factor
  uint256 constant PRECISION_FACTOR = 1e12;

  // The weighted NFT contract
  IWeightedNFT public weightNFT;
  // Accrued token per share
  uint256 public accTokenPerShare;
  // The timestamp of the last pool update
  uint256 public lastRewardTimestamp;
  // The timestamp when mining ends
  uint256 public bonusEndTimestamp;
  // Reward tokens created per second
  uint256 public rewardPerSecond;
  // Total staked weight
  uint256 public totalStakedWeight;
  // Info of each user that stakes tokens (stakedToken)
  mapping(address => UserInfo) public userInfo;

  // Mapping from tokenId to staker
  mapping(uint256 => address) public tokenStaker;
  // Mapping from tokenId to weight
  mapping(uint256 => uint256) public tokenWeight;

  // System staking
  ISystemStaking public systemStaking;
  uint256 public minDuration;
  uint256 public stakingPerDevice;
  // bucket id => device count
  mapping(uint256 => uint256) public bucketDeviceCount;
  // device id => bucket id
  mapping(uint256 => uint256) public deviceBucket;

  function initialize(
    address _nft,
    uint256 _startTime,
    uint256 _rewardPerSecond,
    uint256 _totalSeconds,
    address _systemStaking,
    uint256 _minDuration,
    uint256 _stakingPerDevice
  ) external initializer {
    require(_startTime >= block.timestamp, "invalid startTime");
    require(_rewardPerSecond > 0, "invalid reward per second");
    require(_minDuration % 1 days == 0, "invalid duration");

    __Ownable_init();
    __ReentrancyGuard_init();
    weightNFT = IWeightedNFT(_nft);
    lastRewardTimestamp = _startTime;
    rewardPerSecond = _rewardPerSecond;
    bonusEndTimestamp = _startTime + _totalSeconds;
    systemStaking = ISystemStaking(_systemStaking);
    minDuration = _minDuration;
    stakingPerDevice = _stakingPerDevice;
  }

  function updateSystemStakingParameters(uint256 _minDuration, uint256 _stakingPerDevice) external onlyOwner {
    minDuration = _minDuration;
    stakingPerDevice = _stakingPerDevice;
  }

  function updateRewardPerSecond(uint256 _rewardPerSecond) external onlyOwner {
    _updatePool();
    rewardPerSecond = _rewardPerSecond;
    emit NewRewardPerSecond(_rewardPerSecond);
  }

  function updateBonusEndTimestamp(uint256 _bonusEndTimestamp) external onlyOwner {
    require(_bonusEndTimestamp > block.timestamp, "Invalid end timestamp");

    _updatePool();
    bonusEndTimestamp = _bonusEndTimestamp;
    emit NewBonusEndTimestamp(_bonusEndTimestamp);
  }

  function stopReward() external onlyOwner {
    uint256 _now = block.timestamp;
    require(bonusEndTimestamp > _now, "Cannot stop ended cycle");
    bonusEndTimestamp = _now;

    emit StopRewards(_now);
  }

  function deposit(uint256 _bucketId, uint256 _tokenId, address _recipient) public nonReentrant {
    require(systemStaking.ownerOf(_bucketId) == _recipient, "invalid bucket owner");
    Bucket memory bucket = systemStaking.bucketOf(_bucketId);
    require(bucketInLocking(bucket.unlockedAt), "not locking bucket");

    uint256 _bucketDeviceCount = bucketDeviceCount[_bucketId];
    require(bucket.amount >= (_bucketDeviceCount + 1) * stakingPerDevice, "insufficient staking");
    bucketDeviceCount[_bucketId] = _bucketDeviceCount + 1;
    deviceBucket[_tokenId] = _bucketId;

    UserInfo storage user = userInfo[_recipient];
    _updatePool();

    uint256 _pending = 0;
    if (user.amount > 0) {
      _pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
      if (_pending > 0) {
        (bool success, ) = _recipient.call{value: _pending}("");
        require(success, "Failed to send reward");
      }
    }

    uint256 _amount = weightNFT.weight(_tokenId);
    if (_amount > 0) {
      user.amount = user.amount + _amount;
      IERC721(weightNFT.nft()).safeTransferFrom(msg.sender, address(this), _tokenId);
      tokenStaker[_tokenId] = _recipient;
      tokenWeight[_tokenId] = _amount;
      totalStakedWeight = totalStakedWeight + _amount;
    }

    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit Deposit(_recipient, _bucketId, _tokenId, _pending, _amount);
  }

  function deposit(uint256 _bucketId, uint256 _tokenId) external {
    deposit(_bucketId, _tokenId, msg.sender);
  }

  function withdraw(uint256 _tokenId) external nonReentrant {
    require(tokenStaker[_tokenId] == msg.sender, "invalid staker");
    uint256 _bucketId = deviceBucket[_tokenId];
    require(systemStaking.ownerOf(_bucketId) == msg.sender, "invalid bucket");
    delete deviceBucket[_tokenId];
    bucketDeviceCount[_bucketId] -= 1;
    UserInfo storage user = userInfo[msg.sender];

    _updatePool();

    uint256 _pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;

    uint256 _amount = tokenWeight[_tokenId];
    user.amount = user.amount - _amount;
    IERC721(weightNFT.nft()).safeTransferFrom(address(this), msg.sender, _tokenId);
    tokenStaker[_tokenId] = address(0);
    tokenWeight[_tokenId] = 0;
    totalStakedWeight = totalStakedWeight - _amount;

    if (_pending > 0) {
      (bool success, ) = msg.sender.call{value: _pending}("");
      require(success, "Failed to send reward");
    }

    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit Withdraw(msg.sender, _tokenId, _pending, _amount);
  }

  function emergencyWithdraw(uint256 _tokenId) external nonReentrant {
    require(tokenStaker[_tokenId] == msg.sender, "Invalid staker");
    bucketDeviceCount[deviceBucket[_tokenId]] -= 1;
    delete deviceBucket[_tokenId];
    UserInfo storage user = userInfo[msg.sender];

    uint256 _amount = tokenWeight[_tokenId];

    user.amount = user.amount - _amount;
    IERC721(weightNFT.nft()).safeTransferFrom(address(this), msg.sender, _tokenId);
    tokenStaker[_tokenId] = address(0);
    tokenWeight[_tokenId] = 0;
    totalStakedWeight = totalStakedWeight - _amount;

    emit EmergencyWithdraw(msg.sender, _tokenId, user.amount);
  }

  function poke(uint256 _tokenId) external nonReentrant {
    address _staker = tokenStaker[_tokenId];
    require(_staker != address(0), "Invalid token");

    UserInfo storage user = userInfo[_staker];

    _updatePool();

    uint256 _pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    if (_pending > 0) {
      (bool success, ) = _staker.call{value: _pending}("");
      require(success, "Failed to send reward");
    }

    uint256 _originalWeight = tokenWeight[_tokenId];
    uint256 _newWeight = weightNFT.weight(_tokenId);
    if (_originalWeight != _newWeight) {
      user.amount = user.amount - _originalWeight + _newWeight;
      tokenWeight[_tokenId] = _newWeight;
      totalStakedWeight = totalStakedWeight - _originalWeight + _newWeight;
    }

    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit Poke(_staker, _tokenId, _pending, _originalWeight, _newWeight);
  }

  function claimRewards(address _user) external nonReentrant {
    UserInfo storage user = userInfo[_user];

    _updatePool();

    uint256 _pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    if (_pending > 0) {
      (bool success, ) = _user.call{value: _pending}("");
      require(success, "Failed to send reward");
    }

    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;
    emit ClaimRewards(_user, _pending);
  }

  function pendingReward(address _user) external view returns (uint256) {
    UserInfo storage user = userInfo[_user];
    uint256 _totalStakedWeight = totalStakedWeight;
    if (block.timestamp > lastRewardTimestamp && _totalStakedWeight != 0) {
      uint256 multiplier = _getMultiplier(lastRewardTimestamp, block.timestamp);
      uint256 rewards = multiplier * rewardPerSecond;
      uint256 adjustedTokenPerShare = accTokenPerShare + (rewards * PRECISION_FACTOR) / _totalStakedWeight;
      return (user.amount * adjustedTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    } else {
      return (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    }
  }

  function _updatePool() internal {
    uint256 _now = block.timestamp;
    if (_now <= lastRewardTimestamp) {
      return;
    }

    if (totalStakedWeight == 0) {
      lastRewardTimestamp = _now;
      return;
    }

    uint256 multiplier = _getMultiplier(lastRewardTimestamp, _now);
    uint256 rewards = multiplier * rewardPerSecond;
    accTokenPerShare = accTokenPerShare + (rewards * PRECISION_FACTOR) / totalStakedWeight;
    lastRewardTimestamp = _now;
  }

  function _getMultiplier(uint256 _from, uint256 _to) internal view returns (uint256) {
    if (_to <= bonusEndTimestamp) {
      return _to - _from;
    } else if (_from >= bonusEndTimestamp) {
      return 0;
    } else {
      return bonusEndTimestamp - _from;
    }
  }

  function stakingToken() external view returns (address) {
    return weightNFT.nft();
  }

  function bucketInLocking(uint256 unlockedAt) internal pure returns (bool) {
    return unlockedAt == type(uint256).max;
  }

  receive() external payable {}
}
