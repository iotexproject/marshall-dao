// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ERC20Gauge} from "../contracts/gauges/ERC20Gauge.sol";
import {Voter} from "../contracts/Voter.sol";
import {IRewardGauge} from "../contracts/interfaces/IRewardGauge.sol";
import {DAOForwarder} from "../contracts/DAOForwarder.sol";
import {TestToken} from "../contracts/test/TestToken.sol";
import {ProtocolTimeLibrary} from "../contracts/libraries/ProtocolTimeLibrary.sol";
import {Incentives} from "../contracts/rewards/Incentive.sol";
import "../contracts/test/TestStrategyManager.sol";
import "../contracts/factories/GaugeFactory.sol";
import "../contracts/factories/FactoryRegistry.sol";
import "../contracts/factories/IncentivesFactory.sol";

contract TestERC20Gauge is Test {
  ERC20Gauge public gauge;
  DAOForwarder public forwarder;
  TestToken public pool;
  Voter public voter;
  TestStrategyManager public strategyManager;

  fallback() external payable {}

  function setUp() public {
    pool = new TestToken("lp_pool", "pool");
    forwarder = new DAOForwarder();
    // manager & _factoryRegistry not used in gauge
    strategyManager = new TestStrategyManager();
    strategyManager.setShare(address(this), 100);
    GaugeFactory gaugeFactory = new GaugeFactory();
    IncentivesFactory incentiveFactory = new IncentivesFactory();
    address poolFactory = address(1);
    FactoryRegistry factoryRegistry = new FactoryRegistry(
      poolFactory,
      address(incentiveFactory),
      address(gaugeFactory)
    );
    voter = new Voter(address(forwarder), address(strategyManager), address(factoryRegistry));
    address _gauge = voter.createGauge(poolFactory, address(pool), 0, 0);
    gauge = ERC20Gauge(_gauge);
    voter.killGauge(_gauge);
  }

  function test_deposit() external {
    //1. deposit 0 failed;
    vm.expectRevert(IRewardGauge.ZeroAmount.selector);
    gauge.deposit(0);

    //2. gauge is not alive in voter so failed
    vm.expectRevert(IRewardGauge.NotAlive.selector);
    gauge.deposit(1);

    //3. set alive with gauge in voter;
    voter.reviveGauge(address(gauge));
    pool.approve(address(gauge), 2 ether);
    uint256 before = pool.balanceOf(address(this));
    gauge.deposit(1 ether);
    uint256 _after = pool.balanceOf(address(this));
    assertEq(1 ether, gauge.totalSupply());
    assertEq(1 ether, gauge.balanceOf(address(this)));
    assertEq(before, _after + 1 ether);
    assertEq(1 ether, pool.balanceOf(address(gauge)));

    //4. because no rewards so earned == 0
    assertEq(0, gauge.earned(address(this)));

    //5. deposit again still earned == 0
    gauge.deposit(1 ether);
    assertEq(0, gauge.earned(address(this)));
  }

  function test_notifyRewardAmount_getReward_earned_withdraw_left() external {
    console.log("block time: ", block.timestamp);
    // 0. deposit
    voter.reviveGauge(address(gauge));
    pool.approve(address(gauge), 2 ether);
    gauge.deposit(1 ether);

    // 1. rewardAmount sender not voter failed
    vm.expectRevert(IRewardGauge.NotVoter.selector);
    gauge.notifyRewardAmount{value: 1 ether}();

    // 2. success rewards-1
    // 2.1 deposit rewards to voter
    skip(8 days);
    address[] memory poolvote = new address[](1);
    uint256[] memory weights = new uint256[](1);
    poolvote[0] = address(pool);
    weights[0] = 5000;
    voter.vote(poolvote, weights);
    voter.notifyRewardAmount{value: 90 ether}();
    // 2.2 simulate notify rewards by voter
    vm.prank(address(voter));
    gauge.notifyRewardAmount{value: 1 ether}();
    assertEq(8 days + 1, gauge.lastUpdateTime());
    assertEq(ProtocolTimeLibrary.epochNext(block.timestamp), gauge.periodFinish());
    uint256 firstRate = gauge.rewardRate();
    uint256 firstPeriod = gauge.periodFinish();
    uint256 firstRewardPerToken = gauge.rewardPerToken();
    console.log("firstRewardPerToken: ", firstRewardPerToken);
    skip(3000); // blockTime will set after 3000s
    assertEq(8 days + 3000 + 1, block.timestamp);

    // 3. success reward-2 in same epoch
    vm.prank(address(voter));
    gauge.notifyRewardAmount{value: 1 ether}();
    assertEq(8 days + 3000 + 1, gauge.lastUpdateTime());
    assertGt(gauge.rewardRate(), firstRate);
    assertEq(firstPeriod, gauge.periodFinish());
    assertEq(2 ether, address(gauge).balance);
    uint256 secondRewardPerToken = gauge.rewardPerToken();

    // 4. view earned in first epoch
    skip(14 days - block.timestamp);
    assertEq(block.timestamp, firstPeriod);
    uint256 firstEarned = gauge.earned(address(this));
    console.log("firstPeriod: ", firstPeriod, "; blocktime: ", block.timestamp);
    console.log("first earned 1-epoch: ", firstEarned);
    console.log("secondRewardPerToken: ", secondRewardPerToken);

    // 5. success reward-3 in next epoch
    skip(1 days);
    vm.prank(address(voter));
    gauge.notifyRewardAmount{value: 0.1 ether}();
    uint256 thirdPeriod = gauge.periodFinish();
    assertNotEq(thirdPeriod, firstPeriod);
    assertGt(firstRate, gauge.rewardRate());
    skip(1 days);
    uint256 thirdEarned = gauge.earned(address(this));
    uint256 thirdRewardPerToken = gauge.rewardPerToken();
    console.log("third earned 2-epoch", thirdEarned);
    console.log("thirdPeriod: ", thirdPeriod, "; blocktime: ", block.timestamp);
    console.log("thirdRewardPerToken: ", thirdRewardPerToken);

    // 6. getRewards
    uint256 before = address(this).balance;
    assertEq(0, gauge.rewards(address(this)));
    gauge.claimReward(address(this));
    uint256 after_ = address(this).balance;
    assertEq(before + thirdEarned, after_);

    // 7. withdraw
    before = gauge.balanceOf(address(this));
    gauge.withdraw(1 ether);
    after_ = gauge.balanceOf(address(this));
    assertEq(before - 1 ether, after_);
    // Simulate the task of claiming rewards and then withdrawing lp in one block
    assertEq(0, gauge.rewards(address(this)));

    // 8. left
    uint256 left = gauge.left();
    console.log("left+thirdEarned: ", thirdEarned + left, ", totalReward: ", 2.1 ether);
  }
}
