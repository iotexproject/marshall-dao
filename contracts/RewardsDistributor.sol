// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IRewardsDistributor} from "./interfaces/IRewardsDistributor.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IStrategyManager} from "./interfaces/IStrategyManager.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
 * @title Curve Fee Distribution modified for ve(3,3) emissions
 * @author Curve Finance, andrecronje
 * @author velodrome.finance, @figs999, @pegahcarter
 * @license MIT
 */
contract RewardsDistributor is IRewardsDistributor, ReentrancyGuard {
  using SafeERC20 for IERC20;

  /// @inheritdoc IRewardsDistributor
  address public strategyManager;

  /// @inheritdoc IRewardsDistributor
  address public vault;

  constructor(address manager) {
    vault = msg.sender;
    strategyManager = manager;
  }

  receive() external payable {}

  /// @inheritdoc IRewardsDistributor
  function distributeRewards() external payable {
    if (msg.sender != vault) revert NotVault();
    uint256 _amount = msg.value;
    if (_amount == 0) revert ZeroAmount();
    IStrategyManager(strategyManager).distributeRewards{value: _amount}(address(0x1), _amount);
  }

  /// @inheritdoc IRewardsDistributor
  function distributeRewards(address _token, uint256 _amount) external nonReentrant {
    if (msg.sender != vault) revert NotVault();
    if (_amount == 0) revert ZeroAmount();
    IERC20(_token).safeTransferFrom(msg.sender, strategyManager, _amount);
    IStrategyManager(strategyManager).distributeRewards(_token, _amount);
  }

  /// @inheritdoc IRewardsDistributor
  function setStrategyManager(address _manager) external {
    if (msg.sender != vault) revert NotVault();
    if (_manager == address(0)) revert ZeroAddress();
    strategyManager = _manager;
  }

  /// @inheritdoc IRewardsDistributor
  function setVault(address _vault) external {
    if (msg.sender != vault) revert NotVault();
    if (_vault == address(0)) revert ZeroAddress();
    vault = _vault;
  }
}
