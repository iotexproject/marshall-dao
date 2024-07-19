// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIncentivesFactory} from "../interfaces/factories/IIncentivesFactory.sol";
import {Incentive} from "../rewards/Incentive.sol";

contract IncentivesFactory is IIncentivesFactory {
  /// @inheritdoc IIncentivesFactory
  function createRewards(address _forwarder, address _pool) external returns (address incentiveReward) {
    address[] memory rewards = new address[](1);
    rewards[0] = _pool;
    incentiveReward = address(new Incentive(_forwarder, msg.sender, rewards));
  }
}
