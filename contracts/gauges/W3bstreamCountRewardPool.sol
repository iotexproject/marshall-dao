// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MulticallUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IioID {
  function ownerOf(uint256 _tokenId) external view returns (address);
  function deviceProject(address _device) external view returns (uint256);
}

interface IioIDRegistry {
  function ioID() external view returns (address);
  function exists(address _device) external view returns (bool);
  function deviceTokenId(address _device) external view returns (uint256);
}

contract W3bstreamCountRewardPool is MulticallUpgradeable, OwnableUpgradeable {
  using SafeERC20 for IERC20;

  event Tick(address indexed device);
  event ReceiveRewards(address indexed device, address indexed owner, uint256 rewards);
  event ClaimRewards(address indexed user, uint256 rewards);
  event Withdraw(address indexed token, uint256 amount);
  event ChangeRewardPeriod(uint256 rewardPeriod);
  event ChangeActivePeriodLimit(uint256 activePeriodLimit);
  event ChangeRewardPerPeriod(uint256 rewardPerPeriod);
  event ChangeDApp(address indexed dApp);

  /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
  IioIDRegistry public immutable ioIDRegistry;
  /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
  uint256 public immutable MIN_INTERNAL;

  uint256 public rewardPeriod;
  uint256 public activePeriodLimit;
  uint256 public rewardPerPeriod;
  uint256 public projectId;
  address public dApp;

  mapping(address => mapping(uint256 => uint256)) public validCount;
  mapping(address => mapping(uint256 => bool)) public receivedPeriod;
  mapping(address => uint256) public lastTickTimestamp;
  mapping(address => uint256) public pendingRewards;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(address _ioIDRegistry, uint256 _internal) {
    ioIDRegistry = IioIDRegistry(_ioIDRegistry);
    MIN_INTERNAL = _internal;
  }

  function initialize(
    uint256 _rewardPeriod,
    uint256 _activePeriodLimit,
    uint256 _rewardPerPeriod,
    uint256 _projectId,
    address _dApp
  ) external initializer {
    require(_rewardPeriod > 0 && _activePeriodLimit > 0 && _projectId > 0, "zero value");
    require(_dApp != address(0), "zero address");

    __Multicall_init();
    __Ownable_init();

    rewardPeriod = _rewardPeriod;
    activePeriodLimit = _activePeriodLimit;
    rewardPerPeriod = _rewardPerPeriod;
    projectId = _projectId;
    dApp = _dApp;
  }

  function tick(address _device) external {
    require(msg.sender == dApp, "invalid dApp");

    unchecked {
      require(lastTickTimestamp[_device] + MIN_INTERNAL < block.timestamp, "DDoS");
      IioID ioID = IioID(ioIDRegistry.ioID());
      require(ioID.deviceProject(_device) == projectId, "invalid project");

      uint256 _period = block.timestamp / rewardPeriod;
      validCount[_device][_period] += 1;
      lastTickTimestamp[_device] = block.timestamp;

      if (
        rewardPerPeriod > 0 && !receivedPeriod[_device][_period] && validCount[_device][_period] >= activePeriodLimit
      ) {
        address _owner = ioID.ownerOf(ioIDRegistry.deviceTokenId(_device));
        uint256 _rewardPerPeriod = rewardPerPeriod;
        uint256 _pendingRewards = pendingRewards[_owner] + _rewardPerPeriod;
        receivedPeriod[_device][_period] = true;
        emit ReceiveRewards(_owner, _device, _rewardPerPeriod);

        if (_pendingRewards > 0 && address(this).balance >= _pendingRewards) {
          pendingRewards[_owner] = 0;
          (bool success, ) = _owner.call{value: _pendingRewards}("");
          require(success, "fail claim");

          emit ClaimRewards(_owner, _pendingRewards);
        } else {
          pendingRewards[_owner] = _pendingRewards;
        }
      }
    }

    emit Tick(_device);
  }

  function claimRewards(address _user) external {
    uint256 _rewards = pendingRewards[_user];
    require(_rewards > 0, "no rewards");

    pendingRewards[_user] = 0;
    (bool success, ) = _user.call{value: _rewards}("");
    require(success, "fail claim");

    emit ClaimRewards(_user, _rewards);
  }

  function withdraw(address _token, uint256 _amount) external onlyOwner {
    if (_token == address(0)) {
      (bool success, ) = owner().call{value: _amount}("");
      require(success, "fail withdarw");

      emit Withdraw(_token, _amount);
      return;
    }

    IERC20(_token).safeTransfer(owner(), _amount);

    emit Withdraw(_token, _amount);
  }

  function changeRewardPeriod(uint256 _rewardPeriod) external onlyOwner {
    require(_rewardPeriod > 0, "zero value");
    rewardPeriod = _rewardPeriod;

    emit ChangeRewardPeriod(_rewardPeriod);
  }

  function changeActivePeriodLimit(uint256 _activePeriodLimit) external onlyOwner {
    require(_activePeriodLimit > 0, "zero value");
    activePeriodLimit = _activePeriodLimit;

    emit ChangeActivePeriodLimit(_activePeriodLimit);
  }

  function changeRewardPerPeriod(uint256 _rewardPerPeriod) external onlyOwner {
    rewardPerPeriod = _rewardPerPeriod;

    emit ChangeRewardPerPeriod(_rewardPerPeriod);
  }

  function changeDApp(address _dApp) external onlyOwner {
    require(_dApp != address(0), "zero address");
    dApp = _dApp;

    emit ChangeDApp(_dApp);
  }

  receive() external payable {}
}
