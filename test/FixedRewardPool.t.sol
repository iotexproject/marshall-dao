// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {FixedRewardPool} from "../contracts/gauges/FixedRewardPool.sol";
import {OwnedWeightedNFT} from "../contracts/wrapper/OwnedWeightedNFT.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
  constructor() ERC721("TestNFT", "TEST") {}

  function mint(address to, uint256 tokenId) external {
    _mint(to, tokenId);
  }
}

contract TestFixedRewardPool is Test {
  FixedRewardPool public fixedRewardPool;
  TestNFT public testNFT;
  OwnedWeightedNFT public ownedWeightedNFT;
  address public alice = address(0xa);
  address public bob = address(0xb);
  address public feeCollector = address(0xf);

  function setUp() public {
    testNFT = new TestNFT();
    ownedWeightedNFT = new OwnedWeightedNFT(address(testNFT), alice);
    fixedRewardPool = new FixedRewardPool();
    fixedRewardPool.initialize(address(ownedWeightedNFT), 10, 0.1 ether);
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
    assertEq(fixedRewardPool.lastRewardBlock(), 10);
    assertEq(fixedRewardPool.rewardPerBlock(), 0.1 ether);

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

    vm.roll(5);
    assertEq(fixedRewardPool.pendingReward(bob), 0);

    vm.roll(11);
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
    vm.roll(12);

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

    vm.roll(13);
    assertEq(testNFT.ownerOf(1), address(fixedRewardPool));
    vm.prank(bob);
    fixedRewardPool.withdraw(1);
    assertEq(bob.balance, 0.225 ether);
    assertEq(testNFT.ownerOf(1), bob);
    fixedRewardPool.claimRewards(alice);
    assertEq(alice.balance, 0.075 ether);
    assertEq(fixedRewardPool.totalStakedWeight(), 100);
    assertEq(fixedRewardPool.tokenWeight(1), 0);
  }
}
