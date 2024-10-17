pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestDeviceNFT is ERC721 {

  constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
    _mint(msg.sender, 1);
    _mint(msg.sender, 2);
    _mint(msg.sender, 3);
  }

  function mint(address to, uint tokenId) external {
    _mint(to, tokenId);
  }
}
