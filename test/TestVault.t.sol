// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Vault} from "../contracts/Vault.sol";
import {Voter} from "../contracts/Voter.sol";
import {IVault} from "../contracts/interfaces/IVault.sol";
import {DAOForwarder} from "../contracts/DAOForwarder.sol";
import {TestToken} from "../contracts/test/TestToken.sol";
import {ProtocolTimeLibrary} from "../contracts/libraries/ProtocolTimeLibrary.sol";
import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";
import {FactoryRegistry} from "../contracts/factories/FactoryRegistry.sol";
import {GaugeFactory} from "../contracts/factories/GaugeFactory.sol";
import {IncentivesFactory} from "../contracts/factories/IncentivesFactory.sol";

contract TestVault is Test {
  Vault public vault;
  Voter public voter;
  DAOForwarder public forwarder;
  address public poolFactory;
  GaugeFactory public gaugeFactory;
  IncentivesFactory public incentiveFactory;
  FactoryRegistry public factoryRegistry;
  TestStrategyManager public strategyManager;

  function setUp() public {
    forwarder = new DAOForwarder();
    gaugeFactory = new GaugeFactory();
    incentiveFactory = new IncentivesFactory();
    strategyManager = new TestStrategyManager();
    strategyManager.setShare(address (this), 100);
    poolFactory = address(1);
    factoryRegistry = new FactoryRegistry(poolFactory, address(incentiveFactory), address(gaugeFactory));
    voter = new Voter(address(forwarder), address(strategyManager), address(factoryRegistry));
    vault = new Vault();
    vault.initialize(address(voter), address(strategyManager));
  }

  function test_setGovernor() public {
    //1. failed of NotGovernor
    vm.prank(address(2));
    vm.expectRevert(IVault.NotGovernor.selector);
    vault.setGovernor(address(22));

    //2. failed of ZeroAddress
    vm.expectRevert(IVault.ZeroAddress.selector);
    vault.setGovernor(address(0));

    //3. success
    vault.setGovernor(address(22));
    assertEq(0, vault.activePeriod());
  }

  function test_updatePeriod_donate_withdraw() public {
    // 1. fund native token to vault
    vault.donate{value: 2 ether}();
    assertEq(2 ether, address(vault).balance);

    // 2. withdraw token
    vault.withdraw(address(1), payable(address(2)), 1 ether);
    assertEq(1 ether, address(2).balance);
    assertEq(1 ether, address(vault).balance);

    // 3. elapsed 1 week
    skip(7 days);
    // 4. not enough balance to emission
    vm.expectRevert(IVault.InsufficientFund.selector);
    uint256 _period = vault.emitReward();

    // 5. updatePeriod success
    skip(2 hours);
    payable(address(vault)).transfer(vault.weekly() - 1 ether);
    voter.initialize(new address[](0), address(vault));
    address pool = address (111);
    voter.createGauge(poolFactory, address(pool), 0, 0);
    address[] memory poolvote = new address[](1);
    uint256[] memory weights = new uint256[](1);
    poolvote[0] = address(pool);
    weights[0] = 5000;
    voter.vote(poolvote, weights);
    _period = vault.emitReward();
    assertEq(7 days, _period);
    assertEq(address(vault).balance, 0);
    assertEq(address(strategyManager).balance, vault.weekly() / 10);
    assertEq(address(voter).balance, (90 * vault.weekly()) / 100);
  }

  fallback() external payable {}
}
