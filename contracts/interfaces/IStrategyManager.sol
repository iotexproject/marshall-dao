// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IStrategy.sol";

interface IStrategyManager {

    /**
     * @notice Distribute rewards with native token to strategyManager.
     */
    function distributeRewards(uint256 amount) external payable;

    /**
     * @notice Distribute rewards with erc20 token to strategyManager.
     */
    function distributeRewards(address token, uint256 amount) external returns(bool);
}