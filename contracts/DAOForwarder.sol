// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Forwarder} from "@opengsn/contracts/src/forwarder/Forwarder.sol";

contract DAOForwarder is Forwarder {
  constructor() Forwarder() {}
}
