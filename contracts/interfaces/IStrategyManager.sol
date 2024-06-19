// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IStrategy.sol";

interface IStrategyManager {

    /**
     * @notice change strategy ratio
     */
    function changeStrategyRatio(address strategy, uint256 ratio) external;

    /**
     * @notice convenience function for fetching the total shares of `user`
     */
    function shares(address user) external view returns (uint256);

    /**
     * @notice convenience function for fetching the total shares of `user` at a specific moment in the past.
     */
    function shares(address user, uint256 timepoint) external view returns (uint256);

    /**
     * @notice convenience function for fetching the total shares of `user`
     */
    function shares(address user, address strategy) external view returns (uint256);

    /**
     * @notice convenience function for fetching the total shares of `user` at a specific moment in the past.
     */
    function shares(address user, address strategy, uint256 timepoint) external view returns (uint256);

    /**
     * @notice The total number of extant shares
     */
    function totalShares() external view returns (uint256);

    /**
     * @notice The total number of extant shares at a specific moment in the past.
     */
    function totalShares(uint256 timepoint) external view returns (uint256);

    /**
     * @notice The total number of extant shares
     */
    function totalShares(address strategy) external view returns (uint256);

    /**
     * @notice The total number of extant shares at a specific moment in the past.
     */
    function totalShares(address strategy, uint256 timepoint) external view returns (uint256);

    /**
     * @notice Distribute rewards with native token to strategyManager.
     */
    function rewards(uint256 amount) external payable;

    /**
     * @notice Distribute rewards with erc20 token to strategyManager.
     */
    function rewards(address token, uint256 amount) external returns(bool);
}