// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {IVoter} from "../interfaces/IVoter.sol";
import {IWeightManager} from "../interfaces/IWeightManager.sol";
import {RewardGauge} from "./RewardGauge.sol";
import {IIncentive} from "../interfaces/IIncentive.sol";

contract DeviceGauge is RewardGauge, ERC721Holder {
  event DepositDevice(address indexed from, address indexed to, uint256 amount, uint256 tokenId);
  event WithdrawDevice(address indexed from, uint256 amount, uint256 tokenId);

  mapping(uint256 => address) public tokenStaker;
  mapping(uint256 => uint256) public tokenWeight;

  address public weightManager;

  constructor(
    address _forwarder,
    address _nft,
    address _voter,
    address _incentives
  ) RewardGauge(_forwarder, _nft, _voter, _incentives) {}

  function setWeightManager(address _weightManager) external {
    if (msg.sender != IVoter(voter).team()) revert NotTeam();
    weightManager = _weightManager;
  }

  function _depositFor(uint256 _tokenId, address _recipient) internal override nonReentrant {
    if (_tokenId == 0) revert ZeroAmount();
    if (!IVoter(voter).isAlive(address(this))) revert NotAlive();

    address sender = _msgSender();
    _updateRewards(_recipient);

    IERC721(stakingToken).safeTransferFrom(sender, address(this), _tokenId);
    uint256 _amount = 1;
    if (weightManager != address(0)) {
      _amount = IWeightManager(weightManager).weight(stakingToken, _tokenId);
    }
    totalSupply += _amount;
    balanceOf[_recipient] += _amount;
    tokenStaker[_tokenId] = _recipient;
    tokenWeight[_tokenId] = _amount;
    updateWeightBalance(_recipient);
    IIncentive(incentive).deposit(_amount, _recipient);

    emit DepositDevice(sender, _recipient, _amount, _tokenId);
  }

  function withdraw(uint256 _tokenId) external override nonReentrant {
    address sender = _msgSender();
    require(sender == tokenStaker[_tokenId], "invalid staker");

    _updateRewards(sender);

    uint256 _amount = tokenWeight[_tokenId];
    totalSupply -= _amount;
    balanceOf[sender] -= _amount;
    IERC721(stakingToken).safeTransferFrom(address(this), sender, _tokenId);
    delete tokenStaker[_tokenId];
    delete tokenWeight[_tokenId];
    updateWeightBalance(sender);
    IIncentive(incentive).withdraw(_amount, sender);
    if (balanceOf[sender] == 0){
      depositUserNum--;
    }

    emit WithdrawDevice(sender, _amount, _tokenId);
  }
}
