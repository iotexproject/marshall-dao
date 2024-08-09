// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWeightedNFT {
  function weight(uint256 tokenId) external view returns (uint256);
  function nft() external view returns (address);
}
