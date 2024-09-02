// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IioIDStore {
  function projectDeviceContract(uint256 _projectId) external view returns (address);
  function projectActivedAmount(uint256 _projectId) external view returns (uint256);
}

contract PeriodClaimVault is OwnableUpgradeable {
  event Donation(address indexed donor, uint256 amount);
  event Withdraw(address indexed owner, address recipcient, uint256 amount);
  event Initialize(uint256 period, uint256 rewardPerDevice);
  event AddProject(uint256 projectId, address recipient, uint256 startTimestamp);
  event RemoveProject(uint256 projectId);
  event Claim(uint256 projectId, address recipient, uint256 startTimestamp, uint256 endTimestamp, uint256 rewards);
  event ChangePeriod(uint256 batchSize);
  event ChangeRewardPerDevice(uint256 rewardPerBlock);
  event ChangeRecipient(address indexed admin, uint256 projectId, address recipient);
  event SetInvalidDevice(uint256 projectId, uint256 amount);

  IioIDStore public ioIDStore;
  uint256 public period;
  uint256 public rewardPerDevice;
  uint256 public projectNum;
  mapping(uint256 => address) public projectRecipient;
  mapping(uint256 => uint256) public projectInvalidDevice;
  mapping(uint256 => uint256) public lastClaimedTimestamp;

  function initialize(address _ioIDStore, uint256 _rewardPerDevice) public initializer {
    require(_ioIDStore != address(0), "zero address");
    require(_rewardPerDevice > 0, "invalid reward per device");

    __Ownable_init_unchained();

    ioIDStore = IioIDStore(_ioIDStore);
    uint256 _period = 1 days;
    period = _period;
    rewardPerDevice = _rewardPerDevice;

    emit Initialize(_period, _rewardPerDevice);
  }

  function addProject(uint256 _projectId, address _recipient, uint256 _startTimestamp) external onlyOwner {
    require(_recipient != address(0), "zero address");
    require(_startTimestamp > block.number, "invalid start timestamp");
    require(ioIDStore.projectDeviceContract(_projectId) != address(0), "invalid project");

    projectNum++;
    projectRecipient[_projectId] = _recipient;
    lastClaimedTimestamp[_projectId] = _startTimestamp;
    emit AddProject(_projectId, _recipient, _startTimestamp);
  }

  function removeProject(uint256 _projectId) external onlyOwner {
    require(projectRecipient[_projectId] != address(0), "invalid project");

    delete projectRecipient[_projectId];
    delete lastClaimedTimestamp[_projectId];
    emit RemoveProject(_projectId);
  }

  function claim(uint256 _projectId) external returns (uint256) {
    uint256 _lastClaimedTimestamp = lastClaimedTimestamp[_projectId];
    require(_lastClaimedTimestamp != 0, "invalid project");
    require(_lastClaimedTimestamp + period <= block.number, "claim too short");
    uint256 _claimablePeriods = (block.number - _lastClaimedTimestamp) / period;
    uint256 _rewards = _claimablePeriods *
      rewardPerDevice *
      (ioIDStore.projectActivedAmount(_projectId) - projectInvalidDevice[_projectId]);
    require(address(this).balance >= _rewards, "insufficient fund");
    lastClaimedTimestamp[_projectId] += (_claimablePeriods * period);
    address _recipient = projectRecipient[_projectId];
    (bool success, ) = payable(_recipient).call{value: _rewards}("");
    require(success, "transfer rewards failed");
    emit Claim(_projectId, _recipient, _lastClaimedTimestamp, lastClaimedTimestamp[_projectId], _rewards);
    return _rewards;
  }

  function changePeriod(uint256 _period) external onlyOwner {
    require(_period > 0, "invalid period");
    period = _period;

    emit ChangePeriod(_period);
  }

  function changeRewardPerDevice(uint256 _rewardPerDevice) external onlyOwner {
    require(_rewardPerDevice > 0, "invalid reward per device");
    rewardPerDevice = _rewardPerDevice;

    emit ChangeRewardPerDevice(_rewardPerDevice);
  }

  function setInvalidDevice(uint256 _projectId, uint256 _amount) external onlyOwner {
    require(_amount > 0, "zero amount");
    require(ioIDStore.projectActivedAmount(_projectId) >= _amount, "invalid project");

    projectInvalidDevice[_projectId] = _amount;
    emit SetInvalidDevice(_projectId, _amount);
  }

  function changeRecipient(uint256 _projectId, address _recipient) external {
    require(_recipient != address(0), "zero address");
    require(msg.sender == owner() || msg.sender == projectRecipient[_projectId], "invalid admin");

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
    require(success, "withdraw token failed");
    emit Withdraw(msg.sender, _recipcient, _amount);
  }
}
