// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract VestingMaster is ReentrancyGuard, Ownable {
  using EnumerableSet for EnumerableSet.AddressSet;

  struct LockedReward {
    uint256 locked;
    uint256 timestamp;
  }

  event Lock(address indexed user, uint256 amount);
  event Claim(address indexed user, uint256 amount);
  event LockerAdded(address indexed locker);
  event LockerRemoved(address indexed locker);

  mapping(address => LockedReward[]) public userLockedRewards;
  uint256 public immutable period;
  uint256 public immutable lockedPeriodAmount;
  uint256 public totalLockedRewards;

  EnumerableSet.AddressSet private lockers;

  constructor(uint256 _period, uint256 _lockedPeriodAmount) {
    require(_period > 0, "VestingMaster::constructor: Period zero");
    require(_lockedPeriodAmount > 0, "VestingMaster::constructor: Period amount zero");
    period = _period;
    lockedPeriodAmount = _lockedPeriodAmount;
  }

  function lock(address account) external payable nonReentrant onlyLocker returns (bool) {
    uint256 amount = msg.value;
    LockedReward[] memory oldLockedRewards = userLockedRewards[account];
    uint256 currentTimestamp = block.timestamp;
    LockedReward memory lockedReward;
    uint256 claimableAmount;
    for (uint256 i = 0; i < oldLockedRewards.length; i++) {
      lockedReward = oldLockedRewards[i];
      if (lockedReward.locked > 0 && currentTimestamp >= lockedReward.timestamp) {
        claimableAmount += lockedReward.locked;
        delete oldLockedRewards[i];
      }
    }

    uint256 newStartTimestamp = (currentTimestamp / period) * period;
    uint256 newTimestamp;
    LockedReward memory newLockedReward;
    uint256 jj = 0;
    delete userLockedRewards[account];
    if (claimableAmount > 0) {
      userLockedRewards[account].push(LockedReward({locked: claimableAmount, timestamp: newStartTimestamp}));
    }
    for (uint256 i = 0; i < lockedPeriodAmount; i++) {
      newTimestamp = newStartTimestamp + (i + 1) * period;
      newLockedReward = LockedReward({locked: amount / lockedPeriodAmount, timestamp: newTimestamp});
      for (uint256 j = jj; j < oldLockedRewards.length; j++) {
        lockedReward = oldLockedRewards[j];
        if (lockedReward.timestamp == newTimestamp) {
          newLockedReward.locked += lockedReward.locked;
          jj = j + 1;
          break;
        }
      }
      userLockedRewards[account].push(newLockedReward);
    }
    totalLockedRewards += amount;
    emit Lock(account, amount);
    return true;
  }

  function claim() external nonReentrant returns (bool) {
    LockedReward[] storage lockedRewards = userLockedRewards[msg.sender];
    uint256 currentTimestamp = block.timestamp;
    LockedReward memory lockedReward;
    uint256 claimableAmount;
    for (uint256 i = 0; i < lockedRewards.length; i++) {
      lockedReward = lockedRewards[i];
      if (lockedReward.locked > 0 && currentTimestamp > lockedReward.timestamp) {
        claimableAmount += lockedReward.locked;
        delete lockedRewards[i];
      }
    }
    totalLockedRewards == claimableAmount;
    payable(msg.sender).transfer(claimableAmount);
    emit Claim(msg.sender, claimableAmount);
    return true;
  }

  function getVestingAmount(address account) external view returns (uint256 lockedAmount, uint256 claimableAmount) {
    LockedReward[] memory lockedRewards = userLockedRewards[account];
    uint256 currentTimestamp = block.timestamp;
    LockedReward memory lockedReward;
    for (uint256 i = 0; i < lockedRewards.length; i++) {
      lockedReward = lockedRewards[i];
      if (currentTimestamp > lockedReward.timestamp) {
        claimableAmount += lockedReward.locked;
      } else {
        lockedAmount += lockedReward.locked;
      }
    }
  }

  modifier onlyLocker() {
    require(lockers.contains(msg.sender), "VestingMaster: caller is not the locker");
    _;
  }

  function addLocker(address locker) external onlyOwner {
    if (!lockers.contains(locker)) {
      lockers.add(locker);
      emit LockerAdded(locker);
    }
  }

  function removeLocker(address locker) external onlyOwner {
    if (lockers.contains(locker)) {
      lockers.remove(locker);
      emit LockerRemoved(locker);
    }
  }

  function getLocker(uint256 index) external view returns (address) {
    return lockers.at(index);
  }

  function getLockersCount() public view returns (uint256) {
    return lockers.length();
  }
}
