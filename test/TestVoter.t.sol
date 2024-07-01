// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {stdError} from "forge-std/StdError.sol";
import {TestToken} from "../contracts/test/TestToken.sol";
import {Vault} from "../contracts/Vault.sol";
import {Voter} from "../contracts/Voter.sol";
import {IVoter} from "../contracts/interfaces/IVoter.sol";
import {DAOForwarder} from "../contracts/DAOForwarder.sol";
import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";
import {FactoryRegistry} from "../contracts/factories/FactoryRegistry.sol";
import {GaugeFactory} from "../contracts/factories/GaugeFactory.sol";

contract TestVoter is Test{
    Voter public voter;
    TestToken public pool;
    address  public poolFactory;
    DAOForwarder public forwarder;
    GaugeFactory public gaugeFactory;
    FactoryRegistry public factoryRegistry;

    function setUp() public {
        forwarder = new DAOForwarder();
        pool = new TestToken("test-pool", "pool");
        gaugeFactory = new GaugeFactory();
        poolFactory = address (1);
        TestStrategyManager strategyManager = new TestStrategyManager();
        factoryRegistry = new FactoryRegistry(poolFactory, address (gaugeFactory));
        voter = new Voter(address(forwarder), address(strategyManager), address(factoryRegistry));
    }

    function test_gauge_actions() external {
        //1. createGauge success
        voter.createGauge(poolFactory, address (pool));
        assertEq(1, voter.length());
        assertNotEq(address (0), voter.gauges(address (pool)));

        //1.1 repeat add same pool so failed
        vm.expectRevert(IVoter.GaugeExists.selector);
        voter.createGauge(poolFactory, address (pool));
        assertEq(1, voter.length());

        //1.2 caller not governor & pool is not whitelistedToken
        address pool2 = address (22);
        vm.prank(address (2));
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
        voter.createGauge(poolFactory, address (pool));

        //1. vote
        vm.expectRevert(IVoter.UnequalLengths.selector);
        voter.vote(new address[] (0), new uint256[](1));
        //2. poke
        //3. reset vote
    }
}