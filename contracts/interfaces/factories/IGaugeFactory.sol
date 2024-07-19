// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGaugeFactory {
  function createERC20Gauge(address _forwarder, address _pool, address _incentives) external returns (address);
  function createDeviceGauge(address _forwarder, address _deviceNFT, address _incentives) external returns (address);
  function createWithdrawalGauge(address _guage) external returns (address);
}
