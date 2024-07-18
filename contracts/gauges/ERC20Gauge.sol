// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVoter} from "../interfaces/IVoter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IRewardGauge, RewardGauge} from "./RewardGauge.sol";

contract ERC20Gauge is RewardGauge {
  using SafeERC20 for IERC20;

  event Deposit(address indexed from, address indexed to, uint256 amount);
  event Withdraw(address indexed from, uint256 amount);

  constructor(
    address _forwarder,
    address _stakingToken,
    address _voter
  ) RewardGauge(_forwarder, _stakingToken, _voter) {}

  function _depositFor(uint256 _amount, address _recipient) internal override nonReentrant {
    if (_amount == 0) revert ZeroAmount();
    if (!IVoter(voter).isAlive(address(this))) revert NotAlive();

    address sender = _msgSender();
    _updateRewards(_recipient);

    IERC20(stakingToken).safeTransferFrom(sender, address(this), _amount);
    totalSupply += _amount;
    balanceOf[_recipient] += _amount;

    emit Deposit(sender, _recipient, _amount);
  }

  function withdraw(uint256 _amount) external override nonReentrant {
    address sender = _msgSender();

    _updateRewards(sender);

    totalSupply -= _amount;
    balanceOf[sender] -= _amount;
    IERC20(stakingToken).safeTransfer(sender, _amount);

    emit Withdraw(sender, _amount);
  }
}
