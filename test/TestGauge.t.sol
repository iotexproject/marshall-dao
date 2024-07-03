// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Gauge} from "../contracts/gauges/Gauge.sol";
import {Voter} from "../contracts/Voter.sol";
import {IGauge} from "../contracts/interfaces/IGauge.sol";
import {DAOForwarder} from "../contracts/DAOForwarder.sol";
import {TestToken} from "../contracts/test/TestToken.sol";
import {ProtocolTimeLibrary} from "../contracts/libraries/ProtocolTimeLibrary.sol";

contract TestGauge is Test {
  Gauge public gauge;
  DAOForwarder public forwarder;
  TestToken public pool;
  Voter public voter;

  fallback() external payable {}

  function setUp() public {
    pool = new TestToken("lp_pool", "pool");
    forwarder = new DAOForwarder();
    // manager & _factoryRegistry not used in gauge
    voter = new Voter(address(forwarder), address(this), address(this));
    gauge = new Gauge(address(forwarder), address(pool), address(voter));
  }

  function test_deposit() external {
    //1. deposit 0 failed;
    vm.expectRevert(IGauge.ZeroAmount.selector);
    gauge.deposit(0);

    //2. gauge is not alive in voter so failed
    vm.expectRevert(IGauge.NotAlive.selector);
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
    vm.expectRevert(IGauge.NotVoter.selector);
    gauge.notifyRewardAmount{value: 1 ether}();

    // 2. success rewards-1
    // 2.1 deposit rewards to voter
    voter.notifyRewardAmount{value: 90 ether}();
    // 2.2 simulate notify rewards by voter
    vm.prank(address(voter));
    gauge.notifyRewardAmount{value: 1 ether}();
    assertEq(1, gauge.lastUpdateTime());
    assertEq(ProtocolTimeLibrary.epochNext(block.timestamp), gauge.periodFinish());
    uint256 firstRate = gauge.rewardRate();
    uint256 firstPeriod = gauge.periodFinish();
    uint256 firstRewardPerToken = gauge.rewardPerToken();
    console.log("firstRewardPerToken: ", firstRewardPerToken);
    skip(3000); // blockTime will set after 3000s
    assertEq(3001, block.timestamp);

    // 3. success reward-2 in same epoch
    vm.prank(address(voter));
    gauge.notifyRewardAmount{value: 1 ether}();
    assertEq(3001, gauge.lastUpdateTime());
    assertGt(gauge.rewardRate(), firstRate);
    assertEq(firstPeriod, gauge.periodFinish());
    assertEq(2 ether, address(gauge).balance);
    uint256 secondRewardPerToken = gauge.rewardPerToken();

    // 4. view earned in first epoch
    skip(7 days - block.timestamp);
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
    gauge.getReward(address(this));
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
