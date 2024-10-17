// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWeightManager {
  error DuplicateOperator();
  error NotOperator();
  event OperatorSet(address indexed nft, address indexed operator);

  function weight(address nft, uint256 tokenId) external view returns (uint256);
}
