// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {stdError} from "forge-std/StdError.sol";
import {FactoryRegistry} from "../contracts/factories/FactoryRegistry.sol";
import {IFactoryRegistry} from "../contracts/interfaces/factories/IFactoryRegistry.sol";

contract TestFactories is Test{
    FactoryRegistry registry;

    function setUp() public {
        // 1xxx ==> fallbackFatories
        registry = new FactoryRegistry(address(1), address(11));
    }

    function test_setup_success() external {
        assertEq(address(1), registry.fallbackPoolFactory());
        assertEq(1, registry.poolFactoriesLength());
        assertEq(1, registry.poolFactories().length);
    }

    function test_approve() external {
        //1. has Approved address(1) in setUp()
        vm.expectRevert(IFactoryRegistry.PathAlreadyApproved.selector);
        registry.approve(address(1), address(1111));

        //2. approve 0 address
        vm.expectRevert(IFactoryRegistry.ZeroAddress.selector);
        registry.approve(address(0), address(1111));
        vm.expectRevert(IFactoryRegistry.ZeroAddress.selector);
        registry.approve(address(2), address(0));

        //3. add 2 pool and guage
        registry.approve(address(2), address(22));
        assertEq(2, registry.poolFactories().length);
        assertEq(2, registry.poolFactoriesLength());
        assertEq(address(2), registry.poolFactories()[1]);

        //4. update guageFactoty for 2 pool should failed
        registry.unapprove(address(2));
        vm.expectRevert(IFactoryRegistry.InvalidFactoriesToPoolFactory.selector);
        registry.approve(address(2), address(2222));
        assertEq(1, registry.poolFactories().length);
        assertEq(1, registry.poolFactoriesLength());
        assertEq(address(1), registry.poolFactories()[0]);
    }

    function test_unapprove() public  {
        registry.approve(address(2), address(22));

        vm.expectRevert(IFactoryRegistry.FallbackFactory.selector);
        registry.unapprove(address(1));

        vm.expectRevert(IFactoryRegistry.PathNotApproved.selector);
        registry.unapprove(address(3));

        registry.unapprove(address(2));
        assertEq(1, registry.poolFactories().length);
        assertEq(1, registry.poolFactoriesLength());
        assertEq(address(1), registry.poolFactories()[0]);
    }
}