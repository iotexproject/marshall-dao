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
  event Initialize(uint256 period);
  event AddProject(uint256 projectId, uint256 rewardPerDevice, address recipient, uint256 startTimestamp);
  event RemoveProject(uint256 projectId);
  event Claim(uint256 projectId, address recipient, uint256 startTimestamp, uint256 endTimestamp, uint256 rewards);
  event ChangePeriod(uint256 batchSize);
  event ChangeRewardPerDevice(uint256 projectId, uint256 rewardPerDevice);
  event ChangeRecipient(address indexed admin, uint256 projectId, address recipient);
  event SetInvalidDevice(uint256 projectId, uint256 amount);
  event SetProjectCap(uint256 projectId, uint256 cap);

  IioIDStore public ioIDStore;
  uint256 public period;
  uint256 public projectNum;
  mapping(uint256 => uint256) public rewardPerDevice;
  mapping(uint256 => address) public projectRecipient;
  mapping(uint256 => uint256) public projectInvalidDevice;
  mapping(uint256 => uint256) public lastClaimedTimestamp;
  mapping(uint256 => uint256) public projectCap;

  function initialize(address _ioIDStore) public initializer {
    require(_ioIDStore != address(0), "zero address");

    __Ownable_init_unchained();

    ioIDStore = IioIDStore(_ioIDStore);
    uint256 _period = 1 days;
    period = _period;

    emit Initialize(_period);
  }

  function addProject(
    uint256 _projectId,
    uint256 _rewardPerDevice,
    address _recipient,
    uint256 _startTimestamp
  ) external onlyOwner {
    require(_recipient != address(0), "zero address");
    require(_rewardPerDevice > 0, "invalid reward per device");
    require(_startTimestamp > block.timestamp, "invalid start timestamp");
    require(projectRecipient[_projectId] == address(0), "already added");
    require(ioIDStore.projectDeviceContract(_projectId) != address(0), "invalid project");

    projectNum++;
    rewardPerDevice[_projectId] = _rewardPerDevice;
    projectRecipient[_projectId] = _recipient;
    lastClaimedTimestamp[_projectId] = _startTimestamp;
    emit AddProject(_projectId, _rewardPerDevice, _recipient, _startTimestamp);
  }

  function removeProject(uint256 _projectId) external onlyOwner {
    require(projectRecipient[_projectId] != address(0), "invalid project");

    delete projectRecipient[_projectId];
    delete lastClaimedTimestamp[_projectId];
    projectNum--;
    emit RemoveProject(_projectId);
  }

  function claim(uint256 _projectId) external returns (uint256) {
    uint256 _lastClaimedTimestamp = lastClaimedTimestamp[_projectId];
    require(_lastClaimedTimestamp != 0, "invalid project");
    require(_lastClaimedTimestamp + period <= block.timestamp, "claim too short");
    uint256 _claimablePeriods = (block.timestamp - _lastClaimedTimestamp) / period;

    uint256 _periodRewards = rewardPerDevice[_projectId] *
      (ioIDStore.projectActivedAmount(_projectId) - projectInvalidDevice[_projectId]);
    uint256 _cap = projectCap[_projectId];
    if (_cap != 0 && _periodRewards > _cap) {
      _periodRewards = _cap;
    }

    uint256 _rewards = _claimablePeriods * _periodRewards;
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

  function changeRewardPerDevice(uint256 _projectId, uint256 _rewardPerDevice) external onlyOwner {
    require(_rewardPerDevice > 0, "invalid reward per device");
    require(projectRecipient[_projectId] != address(0), "invalid project");

    rewardPerDevice[_projectId] = _rewardPerDevice;

    emit ChangeRewardPerDevice(_projectId, _rewardPerDevice);
  }

  function setProjectCap(uint256 _projectId, uint256 _cap) external onlyOwner {
    require(_cap > 0, "invalid cap");
    require(projectRecipient[_projectId] != address(0), "invalid project");

    projectCap[_projectId] = _cap;
    emit SetProjectCap(_projectId, _cap);
  }

  function claimableRewards(uint256 _projectId) external view returns (uint256) {
    uint256 _lastClaimedTimestamp = lastClaimedTimestamp[_projectId];
    require(_lastClaimedTimestamp != 0, "invalid project");
    uint256 _claimablePeriods = (block.timestamp - _lastClaimedTimestamp) / period;
    if (_claimablePeriods == 0) {
      return 0;
    }

    uint256 _periodRewards = rewardPerDevice[_projectId] *
      (ioIDStore.projectActivedAmount(_projectId) - projectInvalidDevice[_projectId]);
    uint256 _cap = projectCap[_projectId];
    if (_cap != 0 && _periodRewards > _cap) {
      _periodRewards = _cap;
    }

    return _claimablePeriods * _periodRewards;
  }

  function setInvalidDevice(uint256 _projectId, uint256 _amount) external onlyOwner {
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
