// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {RewardsDistributor} from "../contracts/RewardsDistributor.sol";
import {IRewardsDistributor} from "../contracts/interfaces/IRewardsDistributor.sol";
import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";
import {TestToken} from "../contracts/test/TestToken.sol";

contract TestRewardsDistributor is Test {
  RewardsDistributor public rdb;
  TestStrategyManager public manager;

  function setUp() public {
    manager = new TestStrategyManager();
    rdb = new RewardsDistributor(address(manager));
  }

  function test_SetVault() public {
    // 1. update vault success
    rdb.setVault(address(1));
    assertEq(address(1), rdb.vault());

    //2. should be error when msg.sender != address(1)
    vm.expectRevert(IRewardsDistributor.NotVault.selector);
    rdb.setVault(address(this));

    //3. reUpdate to Address(this)
    vm.prank(address(1));
    rdb.setVault(address(this));
    assertEq(address(this), rdb.vault());

    //4. update to zero Address failed
    vm.expectRevert(IRewardsDistributor.ZeroAddress.selector);
    rdb.setVault(address(0));
  }

  function test_setStrategyManager() public {
    // 1. update StrategyManager success
    rdb.setStrategyManager(address(1));

    //2. should be error when msg.sender != address(1)
    rdb.setVault(address(2));
    vm.expectRevert(IRewardsDistributor.NotVault.selector);
    rdb.setStrategyManager(address(this));

    //3. reUpdate to Address(this)
    vm.prank(address(2));
    vm.expectRevert(IRewardsDistributor.ZeroAddress.selector);
    rdb.setStrategyManager(address(0));
    assertEq(address(1), rdb.strategyManager());
  }

  function test_distributeRewards() public {
    //1. check only vault can send rewards
    rdb.setVault(address(1));
    vm.expectRevert(IRewardsDistributor.NotVault.selector);
    rdb.distributeRewards();

    //2. check amount == 0
    vm.prank(address(1));
    rdb.setVault(address(this));
    vm.expectRevert(IRewardsDistributor.ZeroAmount.selector);
    rdb.distributeRewards();

    //3. set rewards success
    rdb.distributeRewards{value: 1 ether}();
    uint256 amount = manager.rewards(address(1), address(rdb));
    assertEq(1 ether, amount);
  }

  function test_distributeRewards_erc20() public {
    TestToken token = new TestToken("test", "erc20");

    //1. check only vault can send rewards
    rdb.setVault(address(1));
    vm.expectRevert(IRewardsDistributor.NotVault.selector);
    rdb.distributeRewards(address(token), 3 ether);

    //2. check amount == 0
    vm.prank(address(1));
    rdb.setVault(address(this));
    vm.expectRevert(IRewardsDistributor.ZeroAmount.selector);
    rdb.distributeRewards(address(token), 0 ether);

    //3. set rewards success
    console.log("balance of --> ", token.balanceOf(address(this)));
    token.approve(address(rdb), 3 ether);
    rdb.distributeRewards(address(token), 3 ether);
    uint256 amount = manager.rewards(address(token), address(rdb));
    assertEq(3 ether, amount);
  }
}
