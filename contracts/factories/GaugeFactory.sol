// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGaugeFactory} from "../interfaces/factories/IGaugeFactory.sol";
import {ERC20Gauge} from "../gauges/ERC20Gauge.sol";
import {DeviceGauge} from "../gauges/DeviceGauge.sol";

contract GaugeFactory is IGaugeFactory {
  uint8 constant Erc20Gauge = 0;
  uint8 constant DeviceNFTGauge = 1;
  uint8 constant WithdrawGauge = 2;

  function createGauge(
    address _forwarder,
    address _poolOrDeviceNFTOrGauge,
    address _incentives,
    uint8 _gaugeType
  ) external returns (address gauge) {
    address _gauge;
    if (_gaugeType == Erc20Gauge) {
      _gauge = createERC20Gauge(_forwarder, _poolOrDeviceNFTOrGauge, _incentives);
    } else if (_gaugeType == DeviceNFTGauge) {
      _gauge = createDeviceGauge(_forwarder, _poolOrDeviceNFTOrGauge, _incentives);
    } else if (_gaugeType == WithdrawGauge) {
      _gauge = createWithdrawalGauge(_poolOrDeviceNFTOrGauge);
    } else {
      revert IncorrectnessGaugeType();
    }
    return _gauge;
  }

  function createERC20Gauge(address _forwarder, address _pool, address _incentives) internal returns (address gauge) {
    gauge = address(new ERC20Gauge(_forwarder, _pool, msg.sender, _incentives));
  }

  function createDeviceGauge(
    address _forwarder,
    address _deviceNFT,
    address _incentives
  ) internal returns (address gauge) {
    gauge = address(new DeviceGauge(_forwarder, _deviceNFT, msg.sender, _incentives));
  }

  function createWithdrawalGauge(address _guage) internal returns (address gauge) {
    gauge = _guage;
  }
}
