// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Gauge} from "../contracts/gauges/Gauge.sol";
import {Voter} from "../contracts/Voter.sol";
import {IGauge} from "../contracts/interfaces/IGauge.sol";
import {DAOForwarder} from "../contracts/DAOForwarder.sol";
import {TestToken} from "../contracts/test/TestToken.sol";
//import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";


contract TestGauge is Test{
    Gauge public gauge;
    DAOForwarder public forwarder;
    TestToken public pool;
    Voter public voter;
//    TestStrategyManager public manager;

    function setUp() public {
//        manager = new TestStrategyManager();
        pool = new TestToken("lp_pool", "pool");
        forwarder = new DAOForwarder();
        // manager & _factoryRegistry not used in gauge
        voter = new Voter(address (forwarder), address (this), address (this));
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
        pool.approve(address (gauge), 2 ether);
        uint256 before = pool.balanceOf(address (this));
        gauge.deposit(1 ether);
        uint256 _after = pool.balanceOf(address (this));
        assertEq(1 ether, gauge.totalSupply());
        assertEq(1 ether, gauge.balanceOf(address (this)));
        assertEq(before, _after+1 ether);
        assertEq(1 ether, pool.balanceOf(address(gauge)));

        //4. because no rewards so earned == 0
        assertEq(0, gauge.earned(address (this)));

        //5. deposit again still earned == 0
        gauge.deposit(1 ether);
        assertEq(0, gauge.earned(address (this)));
    }

    function test_notifyRewardAmount() external {
        console.log("block time: ", block.timestamp);

        gauge.notifyRewardAmount{value: 1 ether}();
    }
}