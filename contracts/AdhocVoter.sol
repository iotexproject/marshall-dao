// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IAdhocVoter} from "./interfaces/IAdhocVoter.sol";
import {IIncentive} from "./interfaces/IIncentive.sol";
import {IGauge} from "./interfaces/IGauge.sol";
import {IStrategyManager} from "./interfaces/IStrategyManager.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {ITaxGauge} from "./interfaces/ITaxGauge.sol";

/// @title Vault
/// @notice Controls minting of emissions
contract AdhocVoter is IAdhocVoter, Initializable {
  using SafeERC20 for IERC20;
  using EnumerableSet for EnumerableSet.AddressSet;

  address public governor;

  uint256 public constant WEEK = 1 weeks;
  uint256 public weekly;
  uint256 public activePeriod;
  uint256 public epochCount;
  address public constant IOTX_NATIVE_TOKEN = address(1);
  EnumerableSet.AddressSet gauges;
  mapping(address => uint256) public weights;
  uint256 public totalWeight;

  function initialize(
  ) public initializer {
    governor = msg.sender;
    weekly = 100_000 * 1e18;
    activePeriod = ((block.timestamp) / WEEK) * WEEK;
  }

  function isAlive(address) external override pure returns (bool) {
    return true;
  }

  function setGovernor(address _governor) public {
    require(msg.sender == governor, "Not Governor");
    require (_governor != address(0), "ZeroAddress");
    governor = _governor;
    emit GovernorChanged(_governor);
  }

  function emitReward() external returns (uint256 _period) {
    _period = activePeriod;
    if (block.timestamp >= _period + WEEK) {
      epochCount++;
      uint256 _currentPeriod = (block.timestamp / WEEK) * WEEK;
      uint256 elapsed = (_currentPeriod - _period) / WEEK;
      _period = _currentPeriod;
      activePeriod = _period;
      uint256 _emission = weekly * elapsed;

      uint256 _balanceOf = address(this).balance;
      require(_balanceOf >= _emission, "InsufficientFund");

      uint256 perWeightReward = _balanceOf / totalWeight;
      address[] memory _gauges = gauges.values();
      for (uint256 i = 0; i < _gauges.length; i++) {
        address _gauge = _gauges[i];
        uint256 _weight = weights[_gauge];
        IGauge(_gauge).notifyRewardAmount{value: _weight * perWeightReward}();
      }
      emit Emission(msg.sender, _emission);
    }
  }

  function changeWeekly(uint256 _weekly) external {
    require(msg.sender == governor, "Not Governor");

    weekly = _weekly;
    emit WeeklyChanged(_weekly);
  }

  function addGauge(address _gauge, address _incentive, uint256 _weight) external {
    require(_weight >= 10 && _weight <= 100, "invalid weight");
    require(msg.sender == governor, "Not Governor");
    require(!gauges.contains(_gauge), "gauge already exist");

    weights[_gauge] = _weight;
    totalWeight += _weight;
    IIncentive(_incentive).setGauge(_gauge);
    emit WeightChanged(_gauge, _weight);
  }

  function changeWeight(address _gauge, uint256 _weight) external {
    require(_weight >= 10 && _weight <= 100, "invalid weight");
    require(msg.sender == governor, "Not Governor");
    require(gauges.contains(_gauge), "invalid gauge");

    uint256 oldWeight = weights[_gauge];
    weights[_gauge] = _weight;
    totalWeight = totalWeight - oldWeight + _weight;
    emit WeightChanged(_gauge, _weight);
  }

  function withdraw(address _token, address payable _recipcient, uint256 _amount) external {
    require(msg.sender == governor, "Not Governor");

    if (_token == IOTX_NATIVE_TOKEN) {
      (bool success, ) = payable(_recipcient).call{value: _amount}("");
      require(success, "withdraw token failed.");
    } else {
      IERC20(_token).safeTransfer(_recipcient, _amount);
    }
    emit Withdraw(msg.sender, _token, _recipcient, _amount);
  }

  receive() external payable {
    emit Donation(msg.sender, IOTX_NATIVE_TOKEN, msg.value);
  }

  function donate() external payable {
    emit Donation(msg.sender, IOTX_NATIVE_TOKEN, msg.value);
  }

  /// @notice update address of taxer
  /// @param _taxer .
  function changeTaxer(address _gauge, address _taxer) external{
    require(msg.sender == governor, "Not Governor");
    require(gauges.contains(_gauge), "invalid gauge");

    ITaxGauge(_gauge).changeTaxer(_taxer);
  }

  /// @notice update ratio for tax
  /// @param _ratio .
  function changeTaxRatio(address _gauge, uint256 _ratio) external{
    require(msg.sender == governor, "Not Governor");
    require(gauges.contains(_gauge), "invalid gauge");

    ITaxGauge(_gauge).changeTaxRatio(_ratio);
  }

  /// @notice change voter.
  /// @param _voter.
  function changeVoter(address _gauge, address _voter) external{
    require(msg.sender == governor, "Not Governor");
    require(gauges.contains(_gauge), "invalid gauge");

    ITaxGauge(_gauge).changeVoter(_voter);
  }
}
