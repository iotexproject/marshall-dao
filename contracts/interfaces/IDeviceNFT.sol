// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IDeviceNFT is IERC721 {
  function weight(uint256 tokenId) external view returns (uint256);
}
