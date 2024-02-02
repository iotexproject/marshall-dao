// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BokkyPooBahsDateTimeLibrary} from "./art/BokkyPooBahsDateTimeLibrary.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IVeArtProxy} from "./interfaces/IVeArtProxy.sol";
import {IVotingEscrow} from "./interfaces/IVotingEscrow.sol";

/// @title Protocol ArtProxy
/// @notice Official art proxy to generate Protocol veNFT artwork
contract VeArtProxy is IVeArtProxy {
  bytes16 private constant _SYMBOLS = "0123456789abcdef";

  IVotingEscrow public immutable ve;

  string public image;

  constructor(address _ve, string memory _image) {
    ve = IVotingEscrow(_ve);
    image = _image;
  }

  /// @inheritdoc IVeArtProxy
  function tokenURI(uint256 _tokenId) external view returns (string memory output) {
    Config memory cfg = generateConfig(_tokenId);

    string memory date;
    if (cfg._lockedEnd == 0) {
      if (cfg._lockedAmount == 0) {
        date = '"Expired"';
      } else {
        date = '"Permanent"';
      }
    } else {
      uint256 year;
      uint256 month;
      uint256 day;
      (year, month, day) = BokkyPooBahsDateTimeLibrary.timestampToDate(uint256(cfg._lockedEnd));
      date = string(abi.encodePacked('"', toString(year), "-", toString(month), "-", toString(day), '"'));
    }

    string memory attributes = string(abi.encodePacked("{", '"trait_type": "Unlock Date",', '"value": ', date, "},"));

    // stack too deep
    attributes = string(
      abi.encodePacked(
        attributes,
        "{",
        '"trait_type": "Voting Power",',
        '"value": ',
        toString(cfg._balanceOf / 1e18),
        "},",
        "{",
        '"trait_type": "Locked IOTX",'
        '"value": ',
        toString(cfg._lockedAmount / 1e18),
        "},"
        "{",
        '"display_type": "number",',
        '"trait_type": "Number of Digits",',
        '"value": ',
        toString(numBalanceDigits(uint256(cfg._balanceOf))),
        "}"
      )
    );

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            "{",
            '"name": "lock #',
            toString(cfg._tokenId),
            '",',
            '"background_color": "121a26",',
            '"description": "Marshall DAO is a Decentralized Autonomous Organization (DAO) that will employ a vote-escrow on-chain governance protocol.",',
            '"image": "',
            image,
            '",',
            '"attributes": [',
            attributes,
            "]",
            "}"
          )
        )
      )
    );

    output = string(abi.encodePacked("data:application/json;base64,", json));
  }

  /// @inheritdoc IVeArtProxy
  function generateConfig(uint256 _tokenId) public view returns (Config memory cfg) {
    cfg._tokenId = int256(_tokenId);
    cfg._balanceOf = int256(ve.balanceOfNFTAt(_tokenId, block.timestamp));
    IVotingEscrow.LockedBalance memory _locked = ve.locked(_tokenId);
    cfg._lockedEnd = int256(_locked.end);
    cfg._lockedAmount = int256(_locked.amount);
  }

  /// @dev Calculates the number of digits before the "decimal point" in an NFT's veIOTX balance.
  ///      Input expressed in 1e18 format.
  function numBalanceDigits(uint256 _balanceOf) internal pure returns (int256 digitCount) {
    uint256 convertedveIOTXvalue = _balanceOf / 1e18;
    while (convertedveIOTXvalue != 0) {
      convertedveIOTXvalue /= 10;
      digitCount++;
    }
  }

  /**
   * @dev Converts a `int256` to its ASCII `string` decimal representation.
   */
  function toString(int256 value) internal pure returns (string memory) {
    return string(abi.encodePacked(value < 0 ? "-" : "", toString(abs(value))));
  }

  /**
   * @dev Returns the absolute unsigned value of a signed value.
   */
  function abs(int256 n) internal pure returns (uint256) {
    unchecked {
      // must be unchecked in order to support `n = type(int256).min`
      return uint256(n >= 0 ? n : -n);
    }
  }

  /**
   * @dev Return the log in base 10, rounded down, of a positive value.
   * Returns 0 if given 0.
   */
  function log10(uint256 value) internal pure returns (uint256) {
    uint256 result = 0;
    unchecked {
      if (value >= 10 ** 64) {
        value /= 10 ** 64;
        result += 64;
      }
      if (value >= 10 ** 32) {
        value /= 10 ** 32;
        result += 32;
      }
      if (value >= 10 ** 16) {
        value /= 10 ** 16;
        result += 16;
      }
      if (value >= 10 ** 8) {
        value /= 10 ** 8;
        result += 8;
      }
      if (value >= 10 ** 4) {
        value /= 10 ** 4;
        result += 4;
      }
      if (value >= 10 ** 2) {
        value /= 10 ** 2;
        result += 2;
      }
      if (value >= 10 ** 1) {
        result += 1;
      }
    }
    return result;
  }

  /**
   * @dev Converts a `uint256` to its ASCII `string` decimal representation.
   */
  function toString(uint256 value) internal pure returns (string memory) {
    unchecked {
      uint256 length = log10(value) + 1;
      string memory buffer = new string(length);
      uint256 ptr;
      /// @solidity memory-safe-assembly
      assembly {
        ptr := add(buffer, add(32, length))
      }
      while (true) {
        ptr--;
        /// @solidity memory-safe-assembly
        assembly {
          mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
        }
        value /= 10;
        if (value == 0) break;
      }
      return buffer;
    }
  }
}
