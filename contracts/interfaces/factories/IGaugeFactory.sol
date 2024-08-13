// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGaugeFactory {
  error IncorrectnessGaugeType();

  function createGauge(
    address _forwarder,
    address _poolOrDeviceNFTOrGauge,
    address _incentives,
    uint8 _gaugeType,
    uint256 _threshold
  ) external returns (address gauge);
}
