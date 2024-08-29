// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BatchClaimVault is OwnableUpgradeable {
  event Donation(address indexed donor, uint256 amount);
  event Withdraw(address indexed owner, address recipcient, uint256 amount);
  event Initialize(uint256 batchSize, uint256 rewardPerBlock);
  event AddProject(uint256 projectId, address recipient, uint256 startBlock);
  event RemoveProject(uint256 projectId);
  event Claim(uint256 projectId, address recipient, uint256 startBlock, uint256 blocks, uint256 rewards);
  event ChangeBatchSize(uint256 batchSize);
  event ChangeRewardPerBlock(uint256 rewardPerBlock);
  event ChangeRecipient(address indexed admin, uint256 projectId, address recipient);

  uint256 public batchSize;
  uint256 public rewardPerBlock;
  uint256 public projectNum;
  mapping(uint256 => address) public projectRecipient;
  mapping(uint256 => uint256) public lastClaimedBlock;

  function initialize(uint256 _rewardPerBlock) public initializer {
    require(_rewardPerBlock > 0, "invalid reward per block");

    __Ownable_init_unchained();

    batchSize = 17280;
    rewardPerBlock = _rewardPerBlock;

    emit Initialize(17280, rewardPerBlock);
  }

  function addProject(uint256 _projectId, address _recipient, uint256 _startBlock) external onlyOwner {
    require(_recipient != address(0), "zero address");
    require(_startBlock > block.number, "invalid start block");

    projectNum++;
    projectRecipient[_projectId] = _recipient;
    lastClaimedBlock[_projectId] = _startBlock;
    emit AddProject(_projectId, _recipient, _startBlock);
  }

  function removeProject(uint256 _projectId) external onlyOwner {
    require(projectRecipient[_projectId] != address(0), "invalid project");

    delete projectRecipient[_projectId];
    delete lastClaimedBlock[_projectId];
    emit RemoveProject(_projectId);
  }

  function claim(uint256 _projectId) external returns (uint256) {
    uint256 _lastClaimedBlock = lastClaimedBlock[_projectId];
    require(_lastClaimedBlock != 0, "invalid project");
    require(_lastClaimedBlock + batchSize <= block.number, "claim too short");

    uint256 _claimableBlocks = ((block.number - _lastClaimedBlock) / batchSize) * batchSize;
    uint256 _rewards = _claimableBlocks * rewardPerBlock;

    require(address(this).balance >= _rewards, "insufficient fund");
    lastClaimedBlock[_projectId] += _claimableBlocks;

    address _recipient = projectRecipient[_projectId];
    (bool success, ) = payable(_recipient).call{value: _rewards}("");
    require(success, "transfer rewards failed");

    emit Claim(_projectId, _recipient, _lastClaimedBlock, _claimableBlocks, _rewards);
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

  function changeRecipient(uint256 _projectId, address _recipient) external {
    require(_recipient != address(0), "zero address");
    require(msg.sender == owner() || msg.sender == projectRecipient[_projectId], "invalid recipient");

    projectRecipient[_projectId] = _recipient;
    emit ChangeRecipient(msg.sender, _projectId, _recipient);
  }

  receive() external payable {
    emit Donation(msg.sender, msg.value);
  }

  function donate() external payable {
    emit Donation(msg.sender, msg.value);
  }

  function withdraw(address payable _recipcient, uint256 _amount) external onlyOwner {
    (bool success, ) = payable(_recipcient).call{value: _amount}("");
    require(success, "withdraw token failed.");
    emit Withdraw(msg.sender, _recipcient, _amount);
  }
}
