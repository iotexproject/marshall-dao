// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IFactoryRegistry} from "../interfaces/factories/IFactoryRegistry.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title Protocol Factory Registry
/// @author Carter Carlson (@pegahcarter)
/// @notice Protocol Factory Registry to swap and create gauges
contract FactoryRegistry is IFactoryRegistry, Ownable {
  using EnumerableSet for EnumerableSet.AddressSet;

  /// @dev factory to create free and locked rewards for a managed veNFT
  address private _managedRewardsFactory;

  /// @dev The protocol will always have a usable poolFactory, votingRewardsFactory, and gaugeFactory.  The votingRewardsFactory
  // and gaugeFactory are defined to the poolFactory which can never be removed
  address public immutable fallbackPoolFactory;

  /// @dev Array of poolFactories used to create a gauge and votingRewards
  EnumerableSet.AddressSet private _poolFactories;

  struct FactoriesToPoolFactory {
    address incentiveFactory;
    address gaugeFactory;
  }
  /// @dev the factories linked to the poolFactory

  mapping(address => FactoriesToPoolFactory) private _factoriesToPoolsFactory;

  constructor(address _fallbackPoolFactory, address _fallbackIncentiveFactory, address _fallbackGaugeFactory) {
    fallbackPoolFactory = _fallbackPoolFactory;

    approve(_fallbackPoolFactory, _fallbackIncentiveFactory, _fallbackGaugeFactory);
  }

  /// @inheritdoc IFactoryRegistry
  function approve(address poolFactory, address incentiveFactory, address gaugeFactory) public onlyOwner {
    if (poolFactory == address(0) || incentiveFactory == address(0) || gaugeFactory == address(0)) {
      revert ZeroAddress();
    }
    if (_poolFactories.contains(poolFactory)) revert PathAlreadyApproved();

    FactoriesToPoolFactory memory usedFactories = _factoriesToPoolsFactory[poolFactory];

    // If the poolFactory *has not* been approved before, can approve any gauge/votingRewards factory
    // Only one check is sufficient
    if (usedFactories.incentiveFactory == address(0)) {
      _factoriesToPoolsFactory[poolFactory] = FactoriesToPoolFactory(incentiveFactory, gaugeFactory);
    } else {
      // If the poolFactory *has* been approved before, can only approve the same used gauge/votingRewards factory to
      //     to maintain state within Voter
      if (incentiveFactory != usedFactories.incentiveFactory || gaugeFactory != usedFactories.gaugeFactory) {
        revert InvalidFactoriesToPoolFactory();
      }
    }

    _poolFactories.add(poolFactory);
    emit Approve(poolFactory, incentiveFactory, gaugeFactory);
  }

  /// @inheritdoc IFactoryRegistry
  function unapprove(address poolFactory) external onlyOwner {
    if (poolFactory == fallbackPoolFactory) revert FallbackFactory();
    if (!_poolFactories.contains(poolFactory)) revert PathNotApproved();
    _poolFactories.remove(poolFactory);
    (address incentiveFactory, address gaugeFactory) = factoriesToPoolFactory(poolFactory);
    emit Unapprove(poolFactory, incentiveFactory, gaugeFactory);
  }

  /// @inheritdoc IFactoryRegistry
  function factoriesToPoolFactory(
    address poolFactory
  ) public view returns (address incentiveFactory, address gaugeFactory) {
    FactoriesToPoolFactory memory f = _factoriesToPoolsFactory[poolFactory];
    gaugeFactory = f.gaugeFactory;
    incentiveFactory = f.incentiveFactory;
  }

  /// @inheritdoc IFactoryRegistry
  function poolFactories() external view returns (address[] memory) {
    return _poolFactories.values();
  }

  /// @inheritdoc IFactoryRegistry
  function isPoolFactoryApproved(address poolFactory) external view returns (bool) {
    return _poolFactories.contains(poolFactory);
  }

  /// @inheritdoc IFactoryRegistry
  function poolFactoriesLength() external view returns (uint256) {
    return _poolFactories.length();
  }
}
