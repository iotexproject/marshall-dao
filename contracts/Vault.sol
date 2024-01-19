// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IRewardsDistributor} from "./interfaces/IRewardsDistributor.sol";
import {IVoter} from "./interfaces/IVoter.sol";
import {IVotingEscrow} from "./interfaces/IVotingEscrow.sol";

/// @title Vault
/// @author velodrome.finance, @figs999, @pegahcarter
/// @notice Controls minting of emissions and rebases for the Protocol
contract Vault is IVault {
  /// @inheritdoc IVault
  IVoter public immutable voter;
  /// @inheritdoc IVault
  IVotingEscrow public immutable ve;
  /// @inheritdoc IVault
  IRewardsDistributor public immutable rewardsDistributor;

  /// @inheritdoc IVault
  uint256 public constant WEEK = 1 weeks;
  /// @inheritdoc IVault
  uint256 public veRate = 1000; // 10%
  /// @inheritdoc IVault
  uint256 public weekly = 100_000 * 1e18;
  /// @inheritdoc IVault
  uint256 public activePeriod;
  /// @inheritdoc IVault
  uint256 public epochCount;
  /// @inheritdoc IVault
  address public team;
  /// @inheritdoc IVault
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

  /// @inheritdoc IVault
  function setTeam(address _team) external {
    if (msg.sender != team) revert NotTeam();
    if (_team == address(0)) revert ZeroAddress();
    pendingTeam = _team;
  }

  /// @inheritdoc IVault
  function acceptTeam() external {
    if (msg.sender != pendingTeam) revert NotPendingTeam();
    team = pendingTeam;
    delete pendingTeam;
    emit AcceptTeam(team);
  }

  /// @inheritdoc IVault
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

      emit Emission(msg.sender, _emission);
    }
  }

  /// @inheritdoc IVault
  function changeWeekly(uint256 _weekly) external {
    if (msg.sender != team) revert NotTeam();

    weekly = _weekly;
    emit WeeklyChanged(_weekly);
  }

  /// @inheritdoc IVault
  function changeVeRate(uint256 _rate) external {
    if (msg.sender != team) revert NotTeam();
    if (_rate > 5000) revert InvalidRate();

    veRate = _rate;
    emit VeRateChanged(_rate);
  }

  /// @inheritdoc IVault
  function withdraw(address payable _recipcient, uint256 _amount) external {
    if (msg.sender != team) revert NotTeam();
    _recipcient.transfer(_amount);
    emit Withdraw(msg.sender, _recipcient, _amount);
  }

  receive() external payable {
    emit Donation(msg.sender, msg.value);
  }

  /// @inheritdoc IVault
  function donate() external payable {
    if (msg.value == 0) revert ZeroDonation();
    emit Donation(msg.sender, msg.value);
  }
}
