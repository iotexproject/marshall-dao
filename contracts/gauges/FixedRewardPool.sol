// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {IWeightedNFT} from "../interfaces/IWeightedNFT.sol";

contract FixedRewardPool is OwnableUpgradeable, ReentrancyGuardUpgradeable {
  event Deposit(address indexed user, uint256 tokenId, uint256 weight);
  event Withdraw(address indexed user, uint256 tokenId, uint256 weight);
  event EmergencyWithdraw(address indexed user, uint256 tokenId, uint256 weight);

  struct UserInfo {
    uint256 amount; // How many staked tokens the user has provided
    uint256 rewardDebt; // Reward debt
  }

  // The precision factor
  uint256 immutable PRECISION_FACTOR = 1e12;

  // The weighted NFT contract
  IWeightedNFT public weightNFT;
  // Accrued token per share
  uint256 public accTokenPerShare;
  // The block number of the last pool update
  uint256 public lastRewardBlock;
  // Reward tokens created per block.
  uint256 public rewardPerBlock;
  // Total staked weight
  uint256 public totalStakedWeight;
  // Info of each user that stakes tokens (stakedToken)
  mapping(address => UserInfo) public userInfo;

  // Mapping from tokenId to staker
  mapping(uint256 => address) public tokenStaker;
  // Mapping from tokenId to weight
  mapping(uint256 => uint256) public tokenWeight;

  function initialize(address _nft, uint256 _startBlock, uint256 _rewardPerBlock) external initializer {
    require(_startBlock >= block.number, "invalid start block");
    require(_rewardPerBlock > 0, "invalid reward per block");

    __Ownable_init();
    __ReentrancyGuard_init();
    weightNFT = IWeightedNFT(_nft);
    lastRewardBlock = _startBlock;
    rewardPerBlock = _rewardPerBlock;
  }

  function deposit(uint256 _tokenId) external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    _updatePool();

    if (user.amount > 0) {
      uint256 pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
      if (pending > 0) {
        (bool success, ) = msg.sender.call{value: pending}("");
        require(success, "Failed to send reward");
      }
    }

    uint _amount = weightNFT.weight(_tokenId);
    if (_amount > 0) {
      user.amount = user.amount + _amount;
      IERC721(weightNFT.nft()).safeTransferFrom(msg.sender, address(this), _tokenId);
      tokenStaker[_tokenId] = msg.sender;
      tokenWeight[_tokenId] = _amount;
      totalStakedWeight = totalStakedWeight + _amount;
    }

    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit Deposit(msg.sender, _tokenId, _amount);
  }

  function withdraw(uint256 _tokenId) external nonReentrant {
    require(tokenStaker[_tokenId] == msg.sender, "Invalid staker");
    UserInfo storage user = userInfo[msg.sender];

    _updatePool();

    uint256 pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;

    uint256 _amount = tokenWeight[_tokenId];
    user.amount = user.amount - _amount;
    IERC721(weightNFT.nft()).safeTransferFrom(address(this), msg.sender, _tokenId);
    tokenStaker[_tokenId] = address(0);
    tokenWeight[_tokenId] = 0;
    totalStakedWeight = totalStakedWeight - _amount;

    if (pending > 0) {
      (bool success, ) = msg.sender.call{value: pending}("");
      require(success, "Failed to send reward");
    }

    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit Withdraw(msg.sender, _tokenId, _amount);
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

  function pendingReward(address _user) external view returns (uint256) {
    UserInfo storage user = userInfo[_user];
    uint256 _totalStakedWeight = totalStakedWeight;
    if (block.number > lastRewardBlock && _totalStakedWeight != 0) {
      uint256 rewards = (block.number - lastRewardBlock) * rewardPerBlock;
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

    uint256 rewards = (block.number - lastRewardBlock) * rewardPerBlock;
    accTokenPerShare = accTokenPerShare + ((rewards * PRECISION_FACTOR) / totalStakedWeight);
    lastRewardBlock = block.number;
  }

  receive() external payable {}
}
