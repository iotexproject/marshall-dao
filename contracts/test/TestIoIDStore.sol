// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestIoIDStore {
  mapping(uint256 => address) public projectDeviceContract;
  mapping(uint256 => uint256) public projectActivedAmount;

  function setProjectDeviceContract(uint256 _projectId, address _contract) external {
    projectDeviceContract[_projectId] = _contract;
  }

  function setProjectActivedAmount(uint256 _projectId, uint256 _amount) external {
    projectActivedAmount[_projectId] = _amount;
  }
}
