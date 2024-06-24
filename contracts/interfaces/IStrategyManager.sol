// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IStrategyManager {

    /**
     * @notice convenience function for fetching the total shares of `user`
     */
    function shares(address user) external view returns (uint256);

    /**
     * @notice Distribute rewards with erc20 or native iotx token to strategyManager.
     */
    function distributeRewards(address token, uint256 amount) external payable returns(bool);
}