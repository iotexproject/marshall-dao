// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IRewardsDistributor} from "./interfaces/IRewardsDistributor.sol";
import {IVoter} from "./interfaces/IVoter.sol";
import {IVotingEscrow} from "./interfaces/IVotingEscrow.sol";

/// @title Vault
/// @notice Controls minting of emissions and rebases for the Protocol
contract Vault is IVault, Initializable {
  using SafeERC20 for IERC20;

  /// @inheritdoc IVault
  IVoter public voter;
  /// @inheritdoc IVault
  address public governor;
  /// @inheritdoc IVault
  IVotingEscrow public ve;
  /// @inheritdoc IVault
  IRewardsDistributor public rewardsDistributor;

  /// @inheritdoc IVault
  uint256 public constant WEEK = 1 weeks;
  /// @inheritdoc IVault
  uint256 public veRate;
  /// @inheritdoc IVault
  uint256 public weekly;
  /// @inheritdoc IVault
  uint256 public activePeriod;
  /// @inheritdoc IVault
  uint256 public epochCount;

  function initialize(
    address _voter, // the voting & distribution system
    address _ve, // the ve(3,3) system that will be locked into
    address _rewardsDistributor // the distribution system that ensures users aren't diluted
  ) public initializer {
    voter = IVoter(_voter);
    ve = IVotingEscrow(_ve);
    governor = msg.sender;
    rewardsDistributor = IRewardsDistributor(_rewardsDistributor);
    veRate = 1000;
    weekly = 100_000 * 1e18; // 10%
    activePeriod = ((block.timestamp) / WEEK) * WEEK; // allow emissions this coming epoch
  }

  /// @inheritdoc IVault
  function setGovernor(address _governor) public {
    if (msg.sender != governor) revert NotGovernor();
    if (_governor == address(0)) revert ZeroAddress();
    governor = _governor;
    emit GovernorChanged(_governor);
  }

  /// @inheritdoc IVault
  function updatePeriod() external returns (uint256 _period) {
    _period = activePeriod;
    if (block.timestamp >= _period + WEEK) {
      epochCount++;
      uint256 _currentPeriod = (block.timestamp / WEEK) * WEEK;
      uint256 elapsed = (_currentPeriod - _period) / WEEK;
      _period = _currentPeriod;
      activePeriod = _period;
      uint256 _emission = weekly * elapsed;

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
    if (msg.sender != governor) revert NotGovernor();

    weekly = _weekly;
    emit WeeklyChanged(_weekly);
  }

  /// @inheritdoc IVault
  function changeVeRate(uint256 _rate) external {
    if (msg.sender != governor) revert NotGovernor();
    if (_rate > 5000) revert InvalidRate();

    veRate = _rate;
    emit VeRateChanged(_rate);
  }

  /// @inheritdoc IVault
  function withdraw(address _token, address payable _recipcient, uint256 _amount) external {
    if (msg.sender != governor) revert NotGovernor();

    if (_token == address(0)) {
      _recipcient.transfer(_amount);
    } else {
      IERC20(_token).safeTransfer(_recipcient, _amount);
    }
    emit Withdraw(msg.sender, _token, _recipcient, _amount);
  }

  receive() external payable {
    emit Donation(msg.sender, address(0), msg.value);
  }

  /// @inheritdoc IVault
  function donate() external payable {
    if (msg.value == 0) revert ZeroDonation();
    emit Donation(msg.sender, address(0), msg.value);
  }

  /// @inheritdoc IVault
  function donate(address _token, uint256 _amount) external {
    IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
    emit Donation(msg.sender, _token, _amount);
  }
}
