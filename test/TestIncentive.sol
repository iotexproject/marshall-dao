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
import {DeviceGauge} from "../contracts/gauges/DeviceGauge.sol";
import {TestDeviceNFT} from "../contracts/test/TestDeviceNFT.sol";

contract TestIncentive is Test {
  address[] public rewardTokens;
  DAOForwarder public forwarder;
  Voter public voter;
  TestStrategyManager public strategyManager;
  address public factoryRegistry;
  Incentives public inti;
  ERC20Gauge public gauge;
  TestToken public lp;

  /// device nft and gauge
  DeviceGauge public deviceGauge;
  TestDeviceNFT public dlp;
  Incentives public dinti;

  function onERC721Received(
    address,
    /**
     * operator*
     */
    address,
    /**
     * from*
     */
    uint256,
    /**
     * tokenId*
     */
    bytes calldata
  )
    external
    pure
    returns (
      /**
       * data*
       */
      bytes4
    )
  {
    return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
  }

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

    dlp = new TestDeviceNFT("device nft", "device");
    dinti = new Incentives(address(forwarder), address(voter), rewardTokens);
    deviceGauge = new DeviceGauge(address(forwarder), address(dlp), address(voter), address(dinti));
    vm.prank(address(voter));
    dinti.setGauge(address(deviceGauge));
    voter.reviveGauge(address(deviceGauge));
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

  function test_deposit_withdraw_ERC20() external {
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

  function test_deposit_withdraw_DeviceNFT() external {
    // 1. init dlp state
    dlp.approve(address(deviceGauge), 1);
    dlp.approve(address(deviceGauge), 2);

    // 2. deposit lp into gauge and callback to incentives
    deviceGauge.deposit(1);
    assertEq(1 ether, dinti.balanceOf(address(this)));
    assertEq(1 ether, dinti.totalSupply());

    // 3. again deposit to check increase
    deviceGauge.deposit(2);
    assertEq(3 ether, dinti.balanceOf(address(this)));
    assertEq(3 ether, dinti.totalSupply());

    // 4. rewardRate should be zero due to not notifyReward.
    assertEq(0, dinti.rewardRate(rewardTokens[0]));

    // 5. withdraw
    deviceGauge.withdraw(1);
    assertEq(2 ether, dinti.balanceOf(address(this)));
    assertEq(2 ether, dinti.totalSupply());
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
    inti.notifyRewardAmount(rewardTokens[1], 2 ether);

    uint256 timeUntilNext = ProtocolTimeLibrary.epochNext(block.timestamp) - block.timestamp;
    uint256 epochStart = ProtocolTimeLibrary.epochStart(block.timestamp);
    uint256 expectedRewardRate = 1 ether / timeUntilNext;
    assertEq(expectedRewardRate, inti.rewardRate(rewardTokens[0]));
    assertEq(expectedRewardRate, inti.rewardRateByEpoch(epochStart, rewardTokens[0]));
    assertEq(2 ether / timeUntilNext, inti.rewardRate(rewardTokens[1]));
    assertEq(2 ether / timeUntilNext, inti.rewardRateByEpoch(epochStart, rewardTokens[1]));
    assertEq(block.timestamp, inti.lastUpdateTime(rewardTokens[0]));
    assertEq(block.timestamp, inti.lastUpdateTime(rewardTokens[1]));

    // 3. deposit and will claim
    lp.approve(address(gauge), 10000 ether);
    gauge.deposit(1 ether);
    skip(7 days);
    uint256 _escape = inti.lastTimeRewardApplicable(rewardTokens[0]) - inti.lastUpdateTime(rewardTokens[0]);
    uint256 earned = inti.earned(address(this), rewardTokens[0]);
    assertEq(earned, _escape * expectedRewardRate);
    uint256 before = TestToken(rewardTokens[0]).balanceOf(address(this));
    address[] memory tokens = new address[](1);
    tokens[0] = rewardTokens[0];
    inti.claimReward(tokens);
    uint256 after_ = TestToken(rewardTokens[0]).balanceOf(address(this));
    assertEq(after_ - before, earned);
  }
}
