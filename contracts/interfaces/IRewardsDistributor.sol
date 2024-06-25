// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRewardsDistributor {

  error NotVault();
  error ZeroAddress();
  error ZeroAmount();

  /// @notice distribute rewards with native token to strategyManager.
  function distributeRewards() external payable;

  /// @notice distribute rewards with erc20 to strategyManager.
  function distributeRewards(address _token, uint256 _amount) external;

  /// @notice update strategy manager only vault.
  function setStrategyManager(address _manager) external;

  /// @notice address of  strategyManager
  function strategyManager() external view returns (address);

  /// @notice Address of Vault.sol
  ///         Authorized caller of checkpointToken()
  function vault() external view returns (address);

  /// @notice Used to set vault once on initialization
  /// @dev Callable once by vault only, Vault is immutable
  function setVault(address _vault) external;
}
