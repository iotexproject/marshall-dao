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
import {IIncentive} from "../contracts/interfaces/IIncentive.sol";
import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";

contract TestIncentive is Test {
  address[] public rewardTokens;
  DAOForwarder public forwarder;
  Voter public voter;
  TestStrategyManager public strategyManager;
  address public factoryRegistry;
  Incentives public inti;
  ERC20Gauge public gauge;
  TestToken public lp;

  function setUp() external {
    for (uint256 i; i < 20; i++) {
      TestToken tt = new TestToken("reward-token", "test-token");
      rewardTokens.push(address(tt));
    }
    forwarder = new DAOForwarder();
    strategyManager = new TestStrategyManager();
    factoryRegistry = address(1);
    lp = new TestToken("lp", "test-lp");

    voter = new Voter(address(forwarder), address(strategyManager), factoryRegistry);
    inti = new Incentives(address(forwarder), address(voter), rewardTokens);
    gauge = new ERC20Gauge(address(forwarder), address(lp), address(voter), address(inti));
    vm.prank(address(voter));
    inti.setGauge(address(gauge));
    voter.reviveGauge(address(gauge));
  }

  function test_setup_addRewardToken() external {
    console.log("hello test");
    // 1. check init state
    assertEq(20, inti.limitTokenNum());
    assertEq(rewardTokens[1], inti.rewardAllTokens()[1]);

    // 2. check add exist token
    vm.expectRevert(IIncentive.RewardTokenExist.selector);
    inti.addRewardToken(rewardTokens[0]);

    // 3. check add reward token not WhitelistedToken
    TestToken _nextReward = new TestToken("next", "test");
    vm.expectRevert(IIncentive.NotWhitelisted.selector);
    inti.addRewardToken(address(_nextReward));

    // 4. reward tokens exceed limit
    voter.whitelistToken(address(_nextReward), true);
    vm.expectRevert("number of reward token over limit");
    inti.addRewardToken(address(_nextReward));
  }

  function test_setgauge() external {
    vm.expectRevert("gauge has been set");
    inti.setGauge(address(2));
  }

  function test_deposit_withdraw() external {
    // 1. init lp state
    assertEq(10000 ether, lp.balanceOf(address(this)));
    lp.approve(address(gauge), 10000 ether);

    // 2. deposit lp into gauge and callback to incentives
    gauge.deposit(1 ether);
    assertEq(1 ether, inti.balanceOf(address(this)));
    assertEq(1 ether, inti.totalSupply());

    // 3. again deposit to check increase
    gauge.deposit(2 ether);
    assertEq(3 ether, inti.balanceOf(address(this)));
    assertEq(3 ether, inti.totalSupply());

    // 4. rewardRate should be zero due to not notifyReward.
    assertEq(0, inti.rewardRate(rewardTokens[0]));

    // 5. withdraw
    gauge.withdraw(1 ether);
    assertEq(2 ether, inti.balanceOf(address(this)));
    assertEq(2 ether, inti.totalSupply());
  }

  function test_notifyReward_Claim() external {
    // 1. base check
    vm.expectRevert(IIncentive.ZeroAmount.selector);
    inti.notifyRewardAmount(rewardTokens[0], 0);

    vm.expectRevert(IIncentive.NotRewardToken.selector);
    inti.notifyRewardAmount(address(lp), 100);

    // 2. success notify 1 ether
    TestToken(rewardTokens[0]).approve(address(inti), 10000 ether);
    TestToken(rewardTokens[1]).approve(address(inti), 10000 ether);
    inti.notifyRewardAmount(rewardTokens[0], 1 ether);

    uint256 timeUntilNext = ProtocolTimeLibrary.epochNext(block.timestamp) - block.timestamp;
    uint256 epochStart = ProtocolTimeLibrary.epochStart(block.timestamp);
    uint256 expectedRewardRate = 1 ether / timeUntilNext;
    assertEq(expectedRewardRate, inti.rewardRate(rewardTokens[0]));
    assertEq(expectedRewardRate, inti.rewardRateByEpoch(epochStart, rewardTokens[0]));
  }
}
