// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IStrategyManager} from "../interfaces/IStrategyManager.sol";

contract TestStrategyManager is IStrategyManager {
  //mapping(address => LockedReward[]) public userLockedRewards;
  mapping(address => uint256) public recordShares;
  mapping(address => mapping(address => uint256)) public rewards;

  function shares(address user) external view returns (uint256) {
    return recordShares[user];
  }

  function distributeRewards(address token, uint256 amount) external payable returns (bool) {
    rewards[token][msg.sender] = amount;
    return true;
  }

  function setShare(address _user, uint256 _share) external {
    recordShares[_user] = _share;
  }
}
