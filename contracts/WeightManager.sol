// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IWeightManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WeightManager is Ownable, IWeightManager {
    mapping(address => mapping(uint256 => uint256)) public weights;
    mapping(address => address) public operators;

    modifier onlyOperator(address _nft) {
        if (operators[_nft] != msg.sender) {
            revert NotOperator();
        }
        _;
    }

    function addOperator(address _nft, address _operator) external onlyOwner {
        if (operators[_nft] != address(0)) revert DuplicateOperator();
        operators[_nft] = _operator;
        emit OperatorSet(_nft, _operator);
    }

    function changeOperator(address _nft, address _operator) external onlyOperator(_nft) {
        operators[_nft] = _operator;
        emit OperatorSet(_nft, _operator);
    }

    function setWeight(address _nft, uint256 _tokenId, uint256 _weight) external onlyOperator(_nft) {
        weights[_nft][_tokenId] = _weight;
    }
    
    function weight(address _nft, uint256 _tokenId) external view override returns (uint256) {
        if (operators[_nft] == address(0)) {
            return 1;
        }
        return weights[_nft][_tokenId];
    }
}
