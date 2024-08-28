// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BatchClaimVault is OwnableUpgradeable {
  event Donation(address indexed donor, uint256 amount);
  event Initialize(uint256 startBlock, uint256 batchSize, uint256 rewardPerBlock);
  event AddProject(uint256 projectId, address operator, uint256 startBlock);
  event Claim(uint256 projectId, address operator, uint256 startBlock, uint256 blocks, uint256 rewards);
  event ChangeBatchSize(uint256 batchSize);
  event ChangeRewardPerBlock(uint256 rewardPerBlock);

  uint256 public startBlock;
  uint256 public batchSize;
  uint256 public rewardPerBlock;
  uint256 public projectNum;
  mapping(uint256 => address) public projectOperator;
  mapping(uint256 => uint256) public lastClaimedBlock;

  function initialize(uint256 _startBlock, uint256 _rewardPerBlock) public initializer {
    require(_startBlock > block.number, "invalid start block");
    require(_rewardPerBlock > 0, "invalid reward per block");

    startBlock = _startBlock;
    batchSize = 17280;
    rewardPerBlock = _rewardPerBlock;

    emit Initialize(startBlock, 17280, rewardPerBlock);
  }

  function addProject(uint256 _projectId, address _operator, uint256 _startBlock) external onlyOwner {
    require(_operator != address(0), "zero address");
    require(_startBlock > block.number, "invalid start block");

    projectNum++;
    projectOperator[_projectId] = _operator;
    lastClaimedBlock[_projectId] = _startBlock;
    emit AddProject(_projectId, _operator, _startBlock);
  }

  function claim(uint256 _projectId) external returns (uint256) {
    address _operator = projectOperator[_projectId];
    require(msg.sender != _operator, "invalid operator");
    uint256 _lastClaimedBlock = lastClaimedBlock[_projectId];
    require(_lastClaimedBlock + batchSize <= block.number, "claim too short");

    uint256 _claimableBlocks = ((block.number - _lastClaimedBlock) / batchSize) * batchSize;
    uint256 _rewards = _claimableBlocks * rewardPerBlock;

    require(address(this).balance >= _rewards, "insufficient fund");
    lastClaimedBlock[_projectId] += _claimableBlocks;

    (bool success, ) = payable(_operator).call{value: _rewards}("");
    require(success, "transfer rewards failed");

    emit Claim(_projectId, _operator, _lastClaimedBlock, _claimableBlocks, _rewards);
    return _rewards;
  }

  function changeBatchSize(uint256 _batchSize) external onlyOwner {
    require(_batchSize > 0, "invalid batch size");
    batchSize = _batchSize;

    emit ChangeBatchSize(_batchSize);
  }

  function changeRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
    require(_rewardPerBlock > 0, "invalid reward per block");
    rewardPerBlock = _rewardPerBlock;

    emit ChangeRewardPerBlock(_rewardPerBlock);
  }

  receive() external payable {
    emit Donation(msg.sender, msg.value);
  }

  function donate() external payable {
    emit Donation(msg.sender, msg.value);
  }
}
