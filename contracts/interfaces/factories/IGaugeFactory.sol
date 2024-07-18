// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGaugeFactory {
  function createERC20Gauge(address _forwarder, address _pool) external returns (address);
  function createDeviceGauge(address _forwarder, address _deviceNFT) external returns (address);
  function createWithdrawalGauge(address _guage) external returns (address);
}
