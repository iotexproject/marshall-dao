// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IMinter} from "./interfaces/IMinter.sol";
import {IRewardsDistributor} from "./interfaces/IRewardsDistributor.sol";
import {IVoter} from "./interfaces/IVoter.sol";
import {IVotingEscrow} from "./interfaces/IVotingEscrow.sol";

/// @title Minter
/// @author velodrome.finance, @figs999, @pegahcarter
/// @notice Controls minting of emissions and rebases for the Protocol
contract Minter is IMinter {
  /// @inheritdoc IMinter
  IVoter public immutable voter;
  /// @inheritdoc IMinter
  IVotingEscrow public immutable ve;
  /// @inheritdoc IMinter
  IRewardsDistributor public immutable rewardsDistributor;

  /// @inheritdoc IMinter
  uint256 public constant WEEK = 1 weeks;
  /// @inheritdoc IMinter
  uint256 public veRate = 1000; // 10%
  /// @inheritdoc IMinter
  uint256 public weekly = 100_000 * 1e18;
  /// @inheritdoc IMinter
  uint256 public activePeriod;
  /// @inheritdoc IMinter
  uint256 public epochCount;
  /// @inheritdoc IMinter
  address public team;
  /// @inheritdoc IMinter
  address public pendingTeam;

  constructor(
    address _voter, // the voting & distribution system
    address _ve, // the ve(3,3) system that will be locked into
    address _rewardsDistributor // the distribution system that ensures users aren't diluted
  ) {
    voter = IVoter(_voter);
    ve = IVotingEscrow(_ve);
    team = msg.sender;
    rewardsDistributor = IRewardsDistributor(_rewardsDistributor);
    activePeriod = ((block.timestamp) / WEEK) * WEEK; // allow emissions this coming epoch
  }

  /// @inheritdoc IMinter
  function setTeam(address _team) external {
    if (msg.sender != team) revert NotTeam();
    if (_team == address(0)) revert ZeroAddress();
    pendingTeam = _team;
  }

  /// @inheritdoc IMinter
  function acceptTeam() external {
    if (msg.sender != pendingTeam) revert NotPendingTeam();
    team = pendingTeam;
    delete pendingTeam;
    emit AcceptTeam(team);
  }

  /// @inheritdoc IMinter
  function updatePeriod() external returns (uint256 _period) {
    _period = activePeriod;
    if (block.timestamp >= _period + WEEK) {
      epochCount++;
      _period = (block.timestamp / WEEK) * WEEK;
      activePeriod = _period;
      uint256 _emission = weekly;

      uint256 _balanceOf = address(this).balance;
      if (_balanceOf < _emission) {
        revert InsufficientFund();
      }
      uint256 _veEmission = (_emission * veRate) / 10000;

      payable(address(rewardsDistributor)).transfer(_veEmission);
      rewardsDistributor.checkpointToken(); // checkpoint token balance that was just minted in rewards distributor

      voter.notifyRewardAmount{value: _emission - _veEmission}();

      emit Mint(msg.sender, _emission);
    }
  }

  /// @inheritdoc IMinter
  function changeWeekly(uint256 _weekly) external {
    if (msg.sender != team) revert NotTeam();

    weekly = _weekly;
    emit WeeklyChanged(_weekly);
  }

  /// @inheritdoc IMinter
  function changeVeRate(uint256 _rate) external {
    if (msg.sender != team) revert NotTeam();
    if (_rate > 5000) revert InvalidRate();

    veRate = _rate;
    emit VeRateChanged(_rate);
  }
}
