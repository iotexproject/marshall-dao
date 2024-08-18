// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITaxGauge {
  /// @notice withdraw amount of tax for taxer.
  /// @param _taxer .
  function withdrawTax(address _taxer) external;

  /// @notice update address of taxer
  /// @param _taxer .
  function changeTaxer(address _taxer) external;

  /// @notice update ratio for tax
  /// @param _ratio .
  function changeTaxRatio(uint256 _ratio) external;

  /// @notice change voter.
  /// @param _voter.
  function changeVoter(address _voter) external;
}
