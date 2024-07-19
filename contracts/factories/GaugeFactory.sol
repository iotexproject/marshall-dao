// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGaugeFactory} from "../interfaces/factories/IGaugeFactory.sol";
import {ERC20Gauge} from "../gauges/ERC20Gauge.sol";
import {DeviceGauge} from "../gauges/DeviceGauge.sol";

contract GaugeFactory is IGaugeFactory {
  function createERC20Gauge(address _forwarder, address _pool, address _incentives) external returns (address gauge) {
    gauge = address(new ERC20Gauge(_forwarder, _pool, msg.sender, _incentives));
  }

  function createDeviceGauge(address _forwarder, address _deviceNFT, address _incentives) external override returns (address gauge) {
    gauge = address(new DeviceGauge(_forwarder, _deviceNFT, msg.sender, _incentives));
  }

  function createWithdrawalGauge(address _guage) external pure override returns (address gauge) {
    gauge = _guage;
  }
}
