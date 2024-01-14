// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGaugeFactory} from "../interfaces/factories/IGaugeFactory.sol";
import {Gauge} from "../gauges/Gauge.sol";

contract GaugeFactory is IGaugeFactory {
  function createGauge(address _forwarder, address _pool) external returns (address gauge) {
    gauge = address(new Gauge(_forwarder, _pool, msg.sender));
  }
}
