// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {Multicall} from "../utils/Multicall.sol";
import {IWeightedNFT} from "../interfaces/IWeightedNFT.sol";

contract FixedRewardPoolV2 is Multicall, OwnableUpgradeable, ReentrancyGuardUpgradeable, ERC721Holder {
  string public constant GAUGE_TYPE = "gauge_fixed_reward_pool";
  string public constant GAUGE_VERSION = "0.2.0";

  event Deposit(address indexed user, uint256 tokenId, uint256 rewards, uint256 weight);
  event Withdraw(address indexed user, uint256 tokenId, uint256 rewards, uint256 weight);
  event EmergencyWithdraw(address indexed user, uint256 tokenId, uint256 weight);
  event Poke(address indexed user, uint256 tokenId, uint256 rewards, uint256 originalWeight, uint256 newWeight);
  event ClaimRewards(address indexed user, uint256 rewards);
  event StopRewards(uint256 stopHeight);
  event NewRewardPerBlock(uint256 rewardPerBlock);
  event NewBonusEndBlock(uint256 bonusEndBlock);

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
  // The block number of the last pool update
  uint256 public lastRewardBlock;
  // The block number when mining ends
  uint256 public bonusEndBlock;
  // Reward tokens created per block
  uint256 public rewardPerBlock;
  // Total staked weight
  uint256 public totalStakedWeight;
  // Info of each user that stakes tokens (stakedToken)
  mapping(address => UserInfo) public userInfo;

  // Mapping from tokenId to staker
  mapping(uint256 => address) public tokenStaker;
  // Mapping from tokenId to weight
  mapping(uint256 => uint256) public tokenWeight;

  function initialize(
    address _nft,
    uint256 _startBlock,
    uint256 _rewardPerBlock,
    uint256 _totalBlocks
  ) external initializer {
    require(_startBlock >= block.number, "invalid start block");
    require(_rewardPerBlock > 0, "invalid reward per block");

    __Ownable_init();
    __ReentrancyGuard_init();
    weightNFT = IWeightedNFT(_nft);
    lastRewardBlock = _startBlock;
    rewardPerBlock = _rewardPerBlock;
    bonusEndBlock = _startBlock + _totalBlocks;
  }

  function updateRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
    _updatePool();
    rewardPerBlock = _rewardPerBlock;
    emit NewRewardPerBlock(_rewardPerBlock);
  }

  function updateBonusEndBlock(uint256 _bonusEndBlock) external onlyOwner {
    require(_bonusEndBlock > block.number, "Invalid end block");

    _updatePool();
    bonusEndBlock = _bonusEndBlock;
    emit NewBonusEndBlock(_bonusEndBlock);
  }

  function stopReward() external onlyOwner {
    require(bonusEndBlock < block.number, "Cannot stop ended cycle");
    bonusEndBlock = block.number;

    emit StopRewards(block.number);
  }

  function deposit(uint256 _tokenId, address _recipient) public nonReentrant {
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

    emit Deposit(_recipient, _tokenId, _pending, _amount);
  }

  function deposit(uint256 _tokenId) external {
    deposit(_tokenId, msg.sender);
  }

  function withdraw(uint256 _tokenId) external nonReentrant {
    require(tokenStaker[_tokenId] == msg.sender, "Invalid staker");
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
    if (block.number > lastRewardBlock && _totalStakedWeight != 0) {
      uint256 multiplier = _getMultiplier(lastRewardBlock, block.number);
      uint256 rewards = multiplier * rewardPerBlock;
      uint256 adjustedTokenPerShare = accTokenPerShare + (rewards * PRECISION_FACTOR) / _totalStakedWeight;
      return (user.amount * adjustedTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    } else {
      return (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    }
  }

  function _updatePool() internal {
    if (block.number <= lastRewardBlock) {
      return;
    }

    if (totalStakedWeight == 0) {
      lastRewardBlock = block.number;
      return;
    }

    uint256 multiplier = _getMultiplier(lastRewardBlock, block.number);
    uint256 rewards = multiplier * rewardPerBlock;
    accTokenPerShare = accTokenPerShare + (rewards * PRECISION_FACTOR) / totalStakedWeight;
    lastRewardBlock = block.number;
  }

  function _getMultiplier(uint256 _from, uint256 _to) internal view returns (uint256) {
    if (_to <= bonusEndBlock) {
      return _to - _from;
    } else if (_from >= bonusEndBlock) {
      return 0;
    } else {
      return bonusEndBlock - _from;
    }
  }

  function stakingToken() external view returns (address) {
    return weightNFT.nft();
  }

  receive() external payable {}
}
