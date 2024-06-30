// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {stdError} from "forge-std/StdError.sol";
import {Vault} from "../contracts/Vault.sol";
import {Voter} from "../contracts/Voter.sol";
import {DAOForwarder} from "../contracts/DAOForwarder.sol";
import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";
//import {TestStrategyManager} from "../contracts/test/TestStrategyManager.sol";

contract TestVoter is Test{
    Voter public voter;
    DAOForwarder public forwarder;

    function setUp() public {
        forwarder = new DAOForwarder();
        TestStrategyManager strategyManager = new TestStrategyManager();
        voter = new Voter(address(forwarder), address(strategyManager), address(1));
    }

    function test_MaxEpochNum() external {
        assertEq(30, voter.maxVotingNum());
    }
}