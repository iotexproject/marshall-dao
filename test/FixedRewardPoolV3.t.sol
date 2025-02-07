// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {FixedRewardPoolV3} from "../contracts/gauges/FixedRewardPoolV3.sol";
import {OwnedWeightedNFT} from "../contracts/wrapper/OwnedWeightedNFT.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
  constructor() ERC721("TestNFT", "TEST") {}

  function mint(address to, uint256 tokenId) external {
    _mint(to, tokenId);
  }
}

contract TestFixedRewardPoolV3 is Test {
  FixedRewardPoolV3 public fixedRewardPool;
  TestNFT public testNFT;
  OwnedWeightedNFT public ownedWeightedNFT;
  address public alice = address(0xa);
  address public bob = address(0xb);
  address public feeCollector = address(0xf);

  function setUp() public {
    testNFT = new TestNFT();
    ownedWeightedNFT = new OwnedWeightedNFT(address(testNFT), alice);
    fixedRewardPool = new FixedRewardPoolV3();
    fixedRewardPool.initialize(address(ownedWeightedNFT), 10, 0.1 ether, 3);
  }

  function testOwnership() public {
    assertEq(ownedWeightedNFT.owner(), alice);
    assertEq(fixedRewardPool.owner(), address(this));
  }

  function testSetWeight() public {
    vm.expectRevert("ERC721: invalid token ID");
    ownedWeightedNFT.weight(1);

    testNFT.mint(bob, 1);
    assertEq(ownedWeightedNFT.weight(1), 100);

    vm.prank(bob);
    vm.expectRevert("Ownable: caller is not the owner");
    ownedWeightedNFT.setWeight(1, 200);

    vm.prank(alice);
    ownedWeightedNFT.setWeight(1, 200);
    assertEq(ownedWeightedNFT.weight(1), 200);
  }

  function testMining() public {
    assertEq(fixedRewardPool.lastRewardTimestamp(), 10);
    assertEq(fixedRewardPool.rewardPerSecond(), 0.1 ether);

    testNFT.mint(bob, 1);
    testNFT.mint(bob, 2);
    testNFT.mint(alice, 3);

    vm.startPrank(bob);
    vm.expectRevert("ERC721: caller is not token owner or approved");
    fixedRewardPool.deposit(1);
    testNFT.approve(address(fixedRewardPool), 1);
    fixedRewardPool.deposit(1);
    assertEq(fixedRewardPool.totalStakedWeight(), 100);
    (uint256 amount, uint256 rewardDebt) = fixedRewardPool.userInfo(bob);
    assertEq(amount, 100);
    assertEq(rewardDebt, 0);
    vm.stopPrank();

    vm.warp(5);
    assertEq(fixedRewardPool.pendingReward(bob), 0);

    vm.warp(11);
    assertEq(fixedRewardPool.pendingReward(bob), 0.1 ether);

    vm.expectRevert("Failed to send reward");
    fixedRewardPool.claimRewards(bob);

    payable(address(fixedRewardPool)).transfer(0.1 ether);
    fixedRewardPool.claimRewards(bob);
    assertEq(bob.balance, 0.1 ether);
    assertEq(fixedRewardPool.pendingReward(bob), 0);
    assertEq(address(fixedRewardPool).balance, 0);
    vm.startPrank(alice);
    testNFT.approve(address(fixedRewardPool), 3);
    fixedRewardPool.deposit(3);
    vm.stopPrank();
    assertEq(fixedRewardPool.totalStakedWeight(), 200);

    vm.deal(address(fixedRewardPool), 100 ether);
    vm.warp(12);

    vm.prank(alice);
    ownedWeightedNFT.setWeight(1, 300);
    assertEq(fixedRewardPool.totalStakedWeight(), 200);
    assertEq(bob.balance, 0.1 ether);
    fixedRewardPool.poke(1);
    assertEq(bob.balance, 0.15 ether);
    assertEq(fixedRewardPool.totalStakedWeight(), 400);
    assertEq(alice.balance, 0);
    fixedRewardPool.poke(3);
    assertEq(alice.balance, 0.05 ether);
    assertEq(fixedRewardPool.totalStakedWeight(), 400);

    vm.warp(13);
    assertEq(testNFT.ownerOf(1), address(fixedRewardPool));
    vm.prank(bob);
    fixedRewardPool.withdraw(1);
    assertEq(bob.balance, 0.225 ether);
    assertEq(testNFT.ownerOf(1), bob);
    assertEq(alice.balance, 0.05 ether);
    assertEq(fixedRewardPool.totalStakedWeight(), 100);
    assertEq(fixedRewardPool.tokenWeight(1), 0);

    vm.warp(15);
    assertEq(fixedRewardPool.pendingReward(bob), 0);
    fixedRewardPool.claimRewards(alice);
    assertEq(alice.balance, 0.075 ether);

    vm.warp(20);
    vm.prank(alice);
    fixedRewardPool.withdraw(3);
    assertEq(alice.balance, 0.075 ether);
  }

  function testCycle() public {
    testNFT.mint(bob, 1);
    testNFT.mint(bob, 2);
    testNFT.mint(bob, 3);
    testNFT.mint(bob, 4);

    vm.startPrank(bob);
    vm.warp(15);
    testNFT.approve(address(fixedRewardPool), 1);
    fixedRewardPool.deposit(1);

    vm.warp(20);
    assertEq(bob.balance, 0);
    fixedRewardPool.withdraw(1);
    assertEq(bob.balance, 0);
    testNFT.approve(address(fixedRewardPool), 1);
    fixedRewardPool.deposit(1);
    vm.stopPrank();

    bytes[] memory _calldata = new bytes[](2);
    _calldata[0] = abi.encodeCall(FixedRewardPoolV3.updateRewardPerSecond, (0.2 ether));
    _calldata[1] = abi.encodeCall(FixedRewardPoolV3.updateBonusEndTimestamp, (30));
    fixedRewardPool.multicall(_calldata);

    assertEq(fixedRewardPool.rewardPerSecond(), 0.2 ether);
    assertEq(fixedRewardPool.lastRewardTimestamp(), 20);
    assertEq(fixedRewardPool.bonusEndTimestamp(), 30);

    payable(address(fixedRewardPool)).transfer(2 ether);

    vm.warp(21);
    assertEq(bob.balance, 0);
    assertEq(fixedRewardPool.pendingReward(bob), 0.2 ether);
    fixedRewardPool.claimRewards(bob);
    assertEq(bob.balance, 0.2 ether);

    fixedRewardPool.updateRewardPerSecond(0.1 ether);
    assertEq(fixedRewardPool.pendingReward(bob), 0);
    fixedRewardPool.claimRewards(bob);
    assertEq(bob.balance, 0.2 ether);

    vm.warp(25);
    assertEq(fixedRewardPool.pendingReward(bob), 0.4 ether);
    fixedRewardPool.claimRewards(bob);
    assertEq(bob.balance, 0.6 ether);

    fixedRewardPool.updateRewardPerSecond(0.2 ether);

    vm.warp(30);
    vm.prank(bob);
    fixedRewardPool.withdraw(1);
    assertEq(bob.balance, 1.6 ether);
  }
}
