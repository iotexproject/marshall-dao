// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVeArtProxy {
  /// @dev Art configuration
  struct Config {
    // NFT metadata variables
    int256 _tokenId;
    int256 _balanceOf;
    int256 _lockedEnd;
    int256 _lockedAmount;
  }

  /// @notice Generate a SVG based on veNFT metadata
  /// @param _tokenId Unique veNFT identifier
  /// @return output SVG metadata as HTML tag
  function tokenURI(uint256 _tokenId) external view returns (string memory output);

  /// @notice Generate the master art config metadata for a veNFT
  /// @param _tokenId Unique veNFT identifier
  /// @return cfg Config struct
  function generateConfig(uint256 _tokenId) external view returns (Config memory cfg);
}
