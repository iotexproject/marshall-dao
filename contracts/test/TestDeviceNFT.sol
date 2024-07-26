pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IDeviceNFT} from "../interfaces/IDeviceNFT.sol";

contract TestDeviceNFT is IDeviceNFT, ERC721 {
  mapping(uint256 => uint256) public weightOf;

  constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
    _mint(msg.sender, 1);
    _mint(msg.sender, 2);
    _mint(msg.sender, 3);
    weightOf[1] = 1 ether;
    weightOf[2] = 2 ether;
    weightOf[3] = 3 ether;
  }

  function weight(uint256 tokenId) external view returns (uint256) {
    return weightOf[tokenId];
  }

  function setWeight(uint256 _tokenId, uint256 _weight) public {
    weightOf[_tokenId] = _weight;
  }

  function mint(address to, uint tokenId) external {
    _mint(to, tokenId);
  }
}
