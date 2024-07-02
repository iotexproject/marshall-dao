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

contract TestVoter is Test {
  Voter public voter;
  Vault public vault;
  TestToken public pool;
  address public rdb;
  address public poolFactory;
  DAOForwarder public forwarder;
  GaugeFactory public gaugeFactory;
  FactoryRegistry public factoryRegistry;
  TestStrategyManager public strategyManager;

  function setUp() public {
    forwarder = new DAOForwarder();
    pool = new TestToken("test-pool", "pool");
    gaugeFactory = new GaugeFactory();
    poolFactory = address(1);
    strategyManager = new TestStrategyManager();
    factoryRegistry = new FactoryRegistry(poolFactory, address(gaugeFactory));
    voter = new Voter(address(forwarder), address(strategyManager), address(factoryRegistry));
    vault = new Vault();
    rdb = address(999);
    vault.initialize(address(voter), rdb);
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

  //  function test_distribute() external {
  //    // 0. setup
  //    voter.createGauge(poolFactory, address(pool));
  //    address gauge = voter.gauges(address(pool));
  //    strategyManager.setShare(address(this), 1000);
  //    address[] memory poolvote = new address[](1);
  //    uint256[] memory weights = new uint256[](1);
  //    poolvote[0] = address(pool);
  //    weights[0] = 100;
  //    skip(8 days);
  //    voter.vote(poolvote, weights);
  //    assertEq(strategyManager.shares(address(this)), voter.weights(address(pool)));
  //
  //    vault.donate{value: vault.weekly()}();
  //    assertEq(vault.weekly(), address(vault).balance);
  //
  //    // 1. distribute
  //    voter.distribute(0, 1);
  //  }

  //  function test_vault() external {
  //    IVault(voter.vault()).donate{value: 2 ether}();
  //    assertEq(2 ether, address(vault).balance);
  //
  //    skip(7 days);
  //    vm.expectRevert(IVault.InsufficientFund.selector);
  //    uint256 _period = IVault(voter.vault()).updatePeriod();
  //  }

  function test_notifyReward_updateFor_distribute_claimRewards() external {
    // 0. setup
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
    assertEq(address(vault), voter.vault());
    console.log("actual vault: ", address(vault), ", in contract vault: ", voter.vault());
    //        vm.expectRevert(IVault.InsufficientFund.selector);
    //    vault.updatePeriod();
    //    voter.distribute(0, 1);
    //
    //    // 1. update for special gauge
    //    voter.updateFor(gauge);
    //    assertTrue(voter.isAlive(gauge));
    //    console.log("claimable rewards for gauge ", voter.claimable(address(gauge)));
    //
    //    // 4. user deposit lp to gauge
    //    pool.approve(gauge, 3 ether);
    //    IGauge(gauge).deposit(1 ether);
    //
    //    // 5. claim rewards by user
    //    skip(3 days);
    //    address[] memory gauges = new address[](1);
    //    gauges[0] = gauge;
    //    vm.expectEmit(true, false, false, false);
    //    //        emit IGauge.ClaimRewards(address (this), 0);
    //    voter.claimRewards(gauges);
  }

  function test_distribute_claimRewards() external {
    // 投票
    // 1. 调用voter将ve投票按指定比例投票给多个gauge；每个世代只能voter一次
    // 2. 世代期间如果用户ve票数变动，可以调用poke进行票数更新；poke无法更新gauge之间接收投票的比例
    // 3. 新世代可以调用reset重置投票结果
    // 充值奖励资金
    // 1. 调用 distribute 将奖励资金通过vault的updatePeriod调用充值到voter
    // 1.1 vault 充值资金至voter时调用voter的notifyRewardAmount实现
    // 1.1 distribute 内部基于投票结果将奖励资金从voter充值到gauge
    // 计算gauge的奖励数
    // 1. 调用updateFor基于每个gauge的投票权重，计算指定gauge的奖励资金数值；
    // distribute分发奖励至gauge时基于这个计算的数值
    // 用户claim奖励
    // 1. 调用claimRewards获取指定gauge中可以拿到的奖励
    // 1.1 用户如果想拿到gauge的奖励，需要将pool的lp deposit给gauge
    // 1.2 voter中记录的gauge奖励为通过ve投票引导的额外emission激励
  }
}
