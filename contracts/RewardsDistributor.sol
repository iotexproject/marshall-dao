// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IRewardsDistributor} from "./interfaces/IRewardsDistributor.sol";
import {IVotingEscrow} from "./interfaces/IVotingEscrow.sol";
import {IVault} from "./interfaces/IVault.sol";

/*
 * @title Curve Fee Distribution modified for ve(3,3) emissions
 * @author Curve Finance, andrecronje
 * @author velodrome.finance, @figs999, @pegahcarter
 * @license MIT
 */
contract RewardsDistributor is IRewardsDistributor, ReentrancyGuard {
  /// @inheritdoc IRewardsDistributor
  uint256 public constant WEEK = 7 * 86400;

  /// @inheritdoc IRewardsDistributor
  uint256 public startTime;
  /// @inheritdoc IRewardsDistributor
  mapping(uint256 => uint256) public timeCursorOf;

  /// @inheritdoc IRewardsDistributor
  uint256 public lastTokenTime;
  uint256[1000000000000000] public tokensPerWeek;

  /// @inheritdoc IRewardsDistributor
  IVotingEscrow public immutable ve;
  /// @inheritdoc IRewardsDistributor
  address public vault;
  /// @inheritdoc IRewardsDistributor
  uint256 public tokenLastBalance;

  constructor(address _ve) {
    uint256 _t = (block.timestamp / WEEK) * WEEK;
    startTime = _t;
    lastTokenTime = _t;
    ve = IVotingEscrow(_ve);
    vault = msg.sender;
  }

  receive() external payable {}

  function _checkpointToken() internal {
    uint256 tokenBalance = address(this).balance;
    uint256 toDistribute = tokenBalance - tokenLastBalance;
    tokenLastBalance = tokenBalance;

    uint256 t = lastTokenTime;
    uint256 sinceLast = block.timestamp - t;
    lastTokenTime = block.timestamp;
    uint256 thisWeek = (t / WEEK) * WEEK;
    uint256 nextWeek = 0;
    uint256 timestamp = block.timestamp;

    for (uint256 i = 0; i < 20; i++) {
      nextWeek = thisWeek + WEEK;
      if (timestamp < nextWeek) {
        if (sinceLast == 0 && timestamp == t) {
          tokensPerWeek[thisWeek] += toDistribute;
        } else {
          tokensPerWeek[thisWeek] += (toDistribute * (timestamp - t)) / sinceLast;
        }
        break;
      } else {
        if (sinceLast == 0 && nextWeek == t) {
          tokensPerWeek[thisWeek] += toDistribute;
        } else {
          tokensPerWeek[thisWeek] += (toDistribute * (nextWeek - t)) / sinceLast;
        }
      }
      t = nextWeek;
      thisWeek = nextWeek;
    }
    emit CheckpointToken(timestamp, toDistribute);
  }

  /// @inheritdoc IRewardsDistributor
  function checkpointToken() external {
    if (msg.sender != vault) revert NotVault();
    _checkpointToken();
  }

  function _claim(uint256 _tokenId, uint256 _lastTokenTime) internal returns (uint256) {
    (uint256 toDistribute, uint256 epochStart, uint256 weekCursor) = _claimable(_tokenId, _lastTokenTime);
    timeCursorOf[_tokenId] = weekCursor;
    if (toDistribute == 0) return 0;

    emit Claimed(_tokenId, epochStart, weekCursor, toDistribute);
    return toDistribute;
  }

  function _claimable(
    uint256 _tokenId,
    uint256 _lastTokenTime
  ) internal view returns (uint256 toDistribute, uint256 weekCursorStart, uint256 weekCursor) {
    uint256 _startTime = startTime;
    weekCursor = timeCursorOf[_tokenId];
    weekCursorStart = weekCursor;

    // case where token does not exist
    uint256 maxUserEpoch = ve.userPointEpoch(_tokenId);
    if (maxUserEpoch == 0) return (0, weekCursorStart, weekCursor);

    // case where token exists but has never been claimed
    if (weekCursor == 0) {
      IVotingEscrow.UserPoint memory userPoint = ve.userPointHistory(_tokenId, 1);
      weekCursor = (userPoint.ts / WEEK) * WEEK;
      weekCursorStart = weekCursor;
    }
    if (weekCursor >= _lastTokenTime) return (0, weekCursorStart, weekCursor);
    if (weekCursor < _startTime) weekCursor = _startTime;

    for (uint256 i = 0; i < 50; i++) {
      if (weekCursor >= _lastTokenTime) break;

      uint256 balance = ve.balanceOfNFTAt(_tokenId, weekCursor + WEEK - 1);
      uint256 supply = ve.totalSupplyAt(weekCursor + WEEK - 1);
      supply = supply == 0 ? 1 : supply;
      toDistribute += (balance * tokensPerWeek[weekCursor]) / supply;
      weekCursor += WEEK;
    }
  }

  /// @inheritdoc IRewardsDistributor
  function claimable(uint256 _tokenId) external view returns (uint256 claimable_) {
    uint256 _lastTokenTime = (lastTokenTime / WEEK) * WEEK;
    (claimable_, , ) = _claimable(_tokenId, _lastTokenTime);
  }

  /// @inheritdoc IRewardsDistributor
  function claim(uint256 _tokenId) external nonReentrant returns (uint256) {
    if (IVault(vault).activePeriod() < ((block.timestamp / WEEK) * WEEK)) revert UpdatePeriod();
    uint256 _timestamp = block.timestamp;
    uint256 _lastTokenTime = lastTokenTime;
    _lastTokenTime = (_lastTokenTime / WEEK) * WEEK;
    uint256 amount = _claim(_tokenId, _lastTokenTime);
    if (amount != 0) {
      IVotingEscrow.LockedBalance memory _locked = ve.locked(_tokenId);
      if (
        ve.lockedToken(_tokenId) != address(0) ||
        ve.tokenIdNative(_tokenId) != 0 ||
        (_timestamp >= _locked.end && !_locked.isPermanent)
      ) {
        address _owner = ve.ownerOf(_tokenId);
        (bool success, ) = payable(_owner).call{value: amount}("");
        require(success, "transfer rewards failed.");
      } else {
        ve.depositFor{value: amount}(_tokenId, amount);
      }
      tokenLastBalance -= amount;
    }
    return amount;
  }

  /// @inheritdoc IRewardsDistributor
  function claimMany(uint256[] calldata _tokenIds) external nonReentrant returns (bool) {
    if (IVault(vault).activePeriod() < ((block.timestamp / WEEK) * WEEK)) revert UpdatePeriod();
    uint256 _timestamp = block.timestamp;
    uint256 _lastTokenTime = lastTokenTime;
    _lastTokenTime = (_lastTokenTime / WEEK) * WEEK;
    uint256 total = 0;
    uint256 _length = _tokenIds.length;

    for (uint256 i = 0; i < _length; i++) {
      uint256 _tokenId = _tokenIds[i];
      if (_tokenId == 0) break;
      uint256 amount = _claim(_tokenId, _lastTokenTime);
      if (amount != 0) {
        IVotingEscrow.LockedBalance memory _locked = ve.locked(_tokenId);
        if (
          ve.lockedToken(_tokenId) != address(0) ||
          ve.tokenIdNative(_tokenId) != 0 ||
          (_timestamp >= _locked.end && !_locked.isPermanent)
        ) {
          address _owner = ve.ownerOf(_tokenId);
          (bool success, ) = payable(_owner).call{value: amount}("");
          require(success, "transfer rewards failed.");
        } else {
          ve.depositFor{value: amount}(_tokenId, amount);
        }
        total += amount;
      }
    }
    if (total != 0) {
      tokenLastBalance -= total;
    }

    return true;
  }

  /// @inheritdoc IRewardsDistributor
  function setVault(address _vault) external {
    if (msg.sender != vault) revert NotVault();
    vault = _vault;
  }
}
