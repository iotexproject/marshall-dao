// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IWeightedNFT} from "../interfaces/IWeightedNFT.sol";

contract OwnedWeightedNFT is Ownable, IWeightedNFT {
  event WeightChanged(uint256 tokenId, uint256 weight);

  uint256 public immutable DEFAULT_WEIGHT = 100;

  address public immutable override nft;
  mapping(uint256 => uint256) _weights;

  constructor(address _nft, address _owner) {
    nft = _nft;
    transferOwnership(_owner);
  }

  function weight(uint256 tokenId) external view override returns (uint256) {
    require(IERC721(nft).ownerOf(tokenId) != address(0), "token not minted");

    uint256 _weight = _weights[tokenId];
    if (_weight == 0) {
      return DEFAULT_WEIGHT;
    }
    return _weights[tokenId];
  }

  function setWeight(uint256 tokenId, uint256 _weight) external onlyOwner {
    require(_weight > 0, "invalid weight");

    _weights[tokenId] = _weight;
    emit WeightChanged(tokenId, _weight);
  }
}
