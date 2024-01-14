// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGaugeFactory {
  function createGauge(address _forwarder, address _pool, address _ve) external returns (address);
}
