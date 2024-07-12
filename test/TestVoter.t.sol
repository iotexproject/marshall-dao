// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {stdError} from "forge-std/StdError.sol";
import {TestToken} from "../contracts/test/TestToken.sol";
import {Vault} from "../contracts/Vault.sol";
import {Voter} from "../contracts/Voter.sol";
import {IVoter} from "../contracts/interfaces/IVoter.sol";
import {IGauge} from "../contracts/interfaces/IGauge.sol";
import {IVault} from "../contracts/interfaces/IVault.sol";
import {DAOForwarder} from "../contracts/DAOForwarder.sol";
import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";
import {FactoryRegistry} from "../contracts/factories/FactoryRegistry.sol";
import {GaugeFactory} from "../contracts/factories/GaugeFactory.sol";
import {IncentivesFactory} from "../contracts/factories/IncentivesFactory.sol";

contract TestVoter is Test {
  Voter public voter;
  Vault public vault;
  TestToken public pool;
  address public poolFactory;
  DAOForwarder public forwarder;
  GaugeFactory public gaugeFactory;
  IncentivesFactory public incentiveFactory;
  FactoryRegistry public factoryRegistry;
  TestStrategyManager public strategyManager;

  function setUp() public {
    forwarder = new DAOForwarder();
    pool = new TestToken("test-pool", "pool");
    gaugeFactory = new GaugeFactory();
    incentiveFactory = new IncentivesFactory();
    poolFactory = address(1);
    strategyManager = new TestStrategyManager();
    factoryRegistry = new FactoryRegistry(poolFactory, address (incentiveFactory), address(gaugeFactory));
    voter = new Voter(address(forwarder), address(strategyManager), address(factoryRegistry));
    vault = new Vault();
    vault.initialize(address(voter), address(strategyManager));
    voter.initialize(new address[](0), address(vault));
  }

  function test_gauge_actions() external {
    //1. createGauge success
    voter.createGauge(poolFactory, address(pool));
    assertEq(1, voter.length());
    assertNotEq(address(0), voter.gauges(address(pool)));

    //1.1 repeat add same pool so failed
    vm.expectRevert(IVoter.GaugeExists.selector);
    voter.createGauge(poolFactory, address(pool));
    assertEq(1, voter.length());

    //1.2 caller not governor & pool is not whitelistedToken
    address pool2 = address(22);
    vm.prank(address(2));
    vm.expectRevert(IVoter.NotWhitelistedToken.selector);
    voter.createGauge(poolFactory, pool2);
    assertEq(1, voter.length());

    //1.3 set whitelistedToken
    voter.whitelistToken(pool2, true);
    voter.createGauge(poolFactory, pool2);
    assertEq(2, voter.length());

    //2. kill gauge
    address gauge2 = voter.gauges(pool2);
    voter.killGauge(gauge2);
    assertFalse(voter.isAlive(gauge2));

    //3. receive gauge
    voter.reviveGauge(gauge2);
    assertTrue(voter.isAlive(gauge2));
    assertEq(2, voter.length());
  }

  function test_vote_actions() external {
    skip(10 days);
    voter.createGauge(poolFactory, address(pool));
    strategyManager.setShare(address(this), 500);

    //1. vote failed due to UnequalLengths
    vm.expectRevert(IVoter.UnequalLengths.selector);
    voter.vote(new address[](0), new uint256[](1));

    //1.1 vote success
    address[] memory poolvote = new address[](1);
    uint256[] memory weights = new uint256[](1);
    poolvote[0] = address(pool);
    weights[0] = 5000;
    voter.vote(poolvote, weights);
    assertEq(strategyManager.shares(address(this)), voter.weights(address(pool)));
    assertEq(strategyManager.shares(address(this)), voter.totalWeight());
    assertEq(strategyManager.shares(address(this)), voter.usedWeights(address(this)));
    assertEq(strategyManager.shares(address(this)), voter.votes(address(this), address(pool)));

    //2. poke
    strategyManager.setShare(address(this), 1000);
    voter.poke();
    assertEq(1000, strategyManager.shares(address(this)));
    assertEq(strategyManager.shares(address(this)), voter.weights(address(pool)));
    assertEq(strategyManager.shares(address(this)), voter.totalWeight());
    assertEq(strategyManager.shares(address(this)), voter.usedWeights(address(this)));
    assertEq(strategyManager.shares(address(this)), voter.votes(address(this), address(pool)));

    //3. vote to record time in lastVoted
    skip(7 days);
    voter.vote(poolvote, weights);
    //3.1 reset vote failed in same epoch
    vm.expectRevert(IVoter.AlreadyVotedOrDeposited.selector);
    voter.reset();

    //3.2 reset success in next epoch
    skip(7 days);
    voter.reset();
    assertEq(0, voter.weights(address(pool)));
    assertEq(0, voter.totalWeight());
    assertEq(0, voter.usedWeights(address(this)));
    assertEq(0, voter.votes(address(this), address(pool)));
  }

  function test_notifyReward_updateFor_distribute_claimRewards() external {
    // 0. setup to create gauge and vote for the gauge
    voter.createGauge(poolFactory, address(pool));
    address gauge = voter.gauges(address(pool));
    strategyManager.setShare(address(this), 1000);
    address[] memory poolvote = new address[](1);
    uint256[] memory weights = new uint256[](1);
    poolvote[0] = address(pool);
    weights[0] = 100;
    skip(8 days);
    voter.vote(poolvote, weights);
    assertEq(strategyManager.shares(address(this)), voter.weights(address(pool)));

    // 2. donate native token to vault
    vault.donate{value: vault.weekly()}();
    assertEq(vault.weekly(), address(vault).balance);

    // 3. distribute emission from vault to voter
    voter.distribute(0, 1);

    // 4. user deposit lp to gauge
    pool.approve(gauge, 3 ether);
    IGauge(gauge).deposit(1 ether);

    // 5. claim rewards by user
    skip(3 days);
    address[] memory gauges = new address[](1);
    gauges[0] = gauge;
    voter.claimRewards(gauges);
  }

  receive() external payable {}
}
