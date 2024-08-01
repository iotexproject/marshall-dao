// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIncentivesFactory} from "../interfaces/factories/IIncentivesFactory.sol";
import {Incentives} from "../rewards/Incentive.sol";

contract IncentivesFactory is IIncentivesFactory {
  /// @inheritdoc IIncentivesFactory
  function createRewards(address _forwarder, address _pool) external returns (address incentiveReward) {
    incentiveReward = address(new Incentives(_forwarder, msg.sender, new address[](0)));
  }
}
