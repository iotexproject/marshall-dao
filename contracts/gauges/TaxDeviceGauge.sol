// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {IVoter} from "../interfaces/IVoter.sol";
import {RewardGauge} from "./RewardGauge.sol";
import {IIncentive} from "../interfaces/IIncentive.sol";
import "../interfaces/ITaxGauge.sol";

contract TaxDeviceGauge is RewardGauge, ERC721Holder, ITaxGauge {
  event DepositDevice(address indexed from, address indexed to, uint256 amount, uint256 tokenId);
  event WithdrawDevice(address indexed from, uint256 amount, uint256 tokenId);
  event SetTaxer(address indexed taxer);
  event SetTaxRatio(address indexed taxer, uint256 ratio);
  event WithdrawTax(address indexed taxer, uint256 amount);

  uint256 constant public DEFAULT_WEIGHT = 100;

  mapping(uint256 => address) public tokenStaker;

  address public taxer;
  uint256 public taxRatio;
  mapping(address => uint256) public taxAmount;

  constructor(
    address _forwarder,
    address _nft,
    address _voter,
    address _incentives
  ) RewardGauge(_forwarder, _nft, _voter, _incentives) {}

  function _depositFor(uint256 _tokenId, address _recipient) internal override nonReentrant {
    if (_tokenId == 0) revert ZeroAmount();
    if (!IVoter(voter).isAlive(address(this))) revert NotAlive();

    address sender = _msgSender();
    _updateRewards(_recipient);

    IERC721(stakingToken).safeTransferFrom(sender, address(this), _tokenId);
    totalSupply += DEFAULT_WEIGHT;
    balanceOf[_recipient] += DEFAULT_WEIGHT;
    tokenStaker[_tokenId] = _recipient;
    updateWeightBalance(_recipient);
    IIncentive(incentive).deposit(DEFAULT_WEIGHT, _recipient);

    emit DepositDevice(sender, _recipient, DEFAULT_WEIGHT, _tokenId);
  }

  function withdraw(uint256 _tokenId) external override nonReentrant {
    address sender = _msgSender();
    require(sender == tokenStaker[_tokenId], "invalid staker");

    _updateRewards(sender);

    totalSupply -= DEFAULT_WEIGHT;
    balanceOf[sender] -= DEFAULT_WEIGHT;
    IERC721(stakingToken).safeTransferFrom(address(this), sender, _tokenId);
    delete tokenStaker[_tokenId];
    updateWeightBalance(sender);
    IIncentive(incentive).withdraw(DEFAULT_WEIGHT, sender);
    if (balanceOf[sender] == 0){
      depositUserNum--;
    }

    emit WithdrawDevice(sender, DEFAULT_WEIGHT, _tokenId);
  }

  function notifyRewardAmount() external override payable nonReentrant {
    address sender = _msgSender();
    uint256 _amount = msg.value;
    if (_amount == 0) revert ZeroAmount();

    uint256 _taxAmount = 0;
    if (taxer != address (0)){
      _taxAmount = _amount * taxRatio / BASE;
      taxAmount[taxer] += _taxAmount;
    }
    _notifyRewardAmount(sender, _amount-_taxAmount);
  }

  function withdrawTax(address _taxer) external nonReentrant {
    uint256 _taxAmount = taxAmount[_taxer];
    require(_taxAmount > 0, "non Amount for taxer");

    taxAmount[_taxer] = 0;
    (bool success, ) = payable(_taxer).call{value: _taxAmount}("");
    require(success, "withdraw tax failed.");
    emit WithdrawTax(_taxer, _taxAmount);
  }

  function changeTaxer(address _taxer) external {
    require(_taxer != taxer, "same address for taxer");
    if (msg.sender != voter) revert NotVoter();

    taxer = _taxer;
    emit SetTaxer(_taxer);
  }

  function changeTaxRatio(uint256 _ratio) external {
    require(_ratio != taxRatio, "same taxRatio for taxer");
    require(_ratio <= 50, "two large tax ratio");
    if (msg.sender != voter) revert NotVoter();

    taxRatio = _ratio;
    emit SetTaxRatio(taxer, _ratio);
  }

  function changeVoter(address _voter) external {
    if (msg.sender != voter) revert NotVoter();
    require(_voter != address (0), "voter not be null");

    voter = _voter;
  }
}
