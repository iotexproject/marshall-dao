// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IVotingRewardsFactory} from "./interfaces/factories/IVotingRewardsFactory.sol";
import {IGauge} from "./interfaces/IGauge.sol";
import {IGaugeFactory} from "./interfaces/factories/IGaugeFactory.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IReward} from "./interfaces/IReward.sol";
import {IVoter} from "./interfaces/IVoter.sol";
import {IVotingEscrow} from "./interfaces/IVotingEscrow.sol";
import {IFactoryRegistry} from "./interfaces/factories/IFactoryRegistry.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ProtocolTimeLibrary} from "./libraries/ProtocolTimeLibrary.sol";

/// @title Protocol Voter
/// @author velodrome.finance, @figs999, @pegahcarter
/// @notice Manage votes, emission distribution, and gauge creation within the Protocol's ecosystem.
///         Also provides support for depositing and withdrawing from managed veNFTs.
contract Voter is IVoter, ERC2771Context, ReentrancyGuard {
  /// @inheritdoc IVoter
  address public immutable forwarder;
  /// @inheritdoc IVoter
  address public immutable ve;
  /// @inheritdoc IVoter
  address public immutable factoryRegistry;
  /// @notice Rewards are released over 7 days
  uint256 internal constant DURATION = 7 days;
  /// @inheritdoc IVoter
  address public vault;
  /// @inheritdoc IVoter
  address public governor;
  /// @inheritdoc IVoter
  address public emergencyCouncil;

  /// @inheritdoc IVoter
  uint256 public totalWeight;
  /// @inheritdoc IVoter
  uint256 public maxVotingNum;
  uint256 internal constant MIN_MAXVOTINGNUM = 10;

  /// @dev All pools viable for incentives
  address[] public pools;
  /// @inheritdoc IVoter
  mapping(address => address) public gauges;
  /// @inheritdoc IVoter
  mapping(address => address) public poolForGauge;
  /// @inheritdoc IVoter
  mapping(address => address) public gaugeToBribe;
  /// @inheritdoc IVoter
  mapping(address => uint256) public weights;
  /// @inheritdoc IVoter
  mapping(uint256 => mapping(address => uint256)) public votes;
  /// @dev NFT => List of pools voted for by NFT
  mapping(uint256 => address[]) public poolVote;
  /// @inheritdoc IVoter
  mapping(uint256 => uint256) public usedWeights;
  /// @inheritdoc IVoter
  mapping(uint256 => uint256) public lastVoted;
  /// @inheritdoc IVoter
  mapping(address => bool) public isGauge;
  /// @inheritdoc IVoter
  mapping(address => bool) public isWhitelistedToken;
  /// @inheritdoc IVoter
  mapping(uint256 => bool) public isWhitelistedNFT;
  /// @inheritdoc IVoter
  mapping(address => bool) public isAlive;
  /// @dev Accumulated distributions per vote
  uint256 internal index;
  /// @dev Gauge => Accumulated gauge distributions
  mapping(address => uint256) internal supplyIndex;
  /// @inheritdoc IVoter
  mapping(address => uint256) public claimable;

  constructor(address _forwarder, address _ve, address _factoryRegistry) ERC2771Context(_forwarder) {
    forwarder = _forwarder;
    ve = _ve;
    factoryRegistry = _factoryRegistry;
    address _sender = _msgSender();
    vault = _sender;
    governor = _sender;
    emergencyCouncil = _sender;
    maxVotingNum = 30;
  }

  modifier onlyNewEpoch(uint256 _tokenId) {
    // ensure new epoch since last vote
    if (ProtocolTimeLibrary.epochStart(block.timestamp) <= lastVoted[_tokenId]) revert AlreadyVotedOrDeposited();
    if (block.timestamp <= ProtocolTimeLibrary.epochVoteStart(block.timestamp)) revert DistributeWindow();
    _;
  }

  function epochStart(uint256 _timestamp) external pure returns (uint256) {
    return ProtocolTimeLibrary.epochStart(_timestamp);
  }

  function epochNext(uint256 _timestamp) external pure returns (uint256) {
    return ProtocolTimeLibrary.epochNext(_timestamp);
  }

  function epochVoteStart(uint256 _timestamp) external pure returns (uint256) {
    return ProtocolTimeLibrary.epochVoteStart(_timestamp);
  }

  function epochVoteEnd(uint256 _timestamp) external pure returns (uint256) {
    return ProtocolTimeLibrary.epochVoteEnd(_timestamp);
  }

  /// @dev requires initialization with at least rewardToken
  function initialize(address[] calldata _tokens, address _vault) external {
    if (_msgSender() != vault) revert NotVault();
    uint256 _length = _tokens.length;
    for (uint256 i = 0; i < _length; i++) {
      _whitelistToken(_tokens[i], true);
    }
    vault = _vault;
  }

  /// @inheritdoc IVoter
  function setGovernor(address _governor) public {
    if (_msgSender() != governor) revert NotGovernor();
    if (_governor == address(0)) revert ZeroAddress();
    governor = _governor;
  }

  /// @inheritdoc IVoter
  function setEmergencyCouncil(address _council) public {
    if (_msgSender() != emergencyCouncil) revert NotEmergencyCouncil();
    if (_council == address(0)) revert ZeroAddress();
    emergencyCouncil = _council;
  }

  /// @inheritdoc IVoter
  function setMaxVotingNum(uint256 _maxVotingNum) external {
    if (_msgSender() != governor) revert NotGovernor();
    if (_maxVotingNum < MIN_MAXVOTINGNUM) revert MaximumVotingNumberTooLow();
    if (_maxVotingNum == maxVotingNum) revert SameValue();
    maxVotingNum = _maxVotingNum;
  }

  /// @inheritdoc IVoter
  function reset(uint256 _tokenId) external onlyNewEpoch(_tokenId) nonReentrant {
    if (!IVotingEscrow(ve).isApprovedOrOwner(msg.sender, _tokenId)) revert NotApprovedOrOwner();
    _reset(_tokenId);
  }

  function _reset(uint256 _tokenId) internal {
    address[] storage _poolVote = poolVote[_tokenId];
    uint256 _poolVoteCnt = _poolVote.length;
    uint256 _totalWeight = 0;

    for (uint256 i = 0; i < _poolVoteCnt; i++) {
      address _pool = _poolVote[i];
      uint256 _votes = votes[_tokenId][_pool];

      if (_votes != 0) {
        _updateFor(gauges[_pool]);
        weights[_pool] -= _votes;
        delete votes[_tokenId][_pool];
        IReward(gaugeToBribe[gauges[_pool]])._withdraw(_votes, _tokenId);
        _totalWeight += _votes;
        emit Abstained(_msgSender(), _pool, _tokenId, _votes, weights[_pool], block.timestamp);
      }
    }
    IVotingEscrow(ve).voting(_tokenId, false);
    totalWeight -= _totalWeight;
    usedWeights[_tokenId] = 0;
    delete poolVote[_tokenId];
  }

  /// @inheritdoc IVoter
  function poke(uint256 _tokenId) external nonReentrant {
    if (block.timestamp <= ProtocolTimeLibrary.epochVoteStart(block.timestamp)) revert DistributeWindow();
    uint256 _weight = IVotingEscrow(ve).balanceOfNFT(_tokenId);
    _poke(_tokenId, _weight);
  }

  function _poke(uint256 _tokenId, uint256 _weight) internal {
    address[] memory _poolVote = poolVote[_tokenId];
    uint256 _poolCnt = _poolVote.length;
    uint256[] memory _weights = new uint256[](_poolCnt);

    for (uint256 i = 0; i < _poolCnt; i++) {
      _weights[i] = votes[_tokenId][_poolVote[i]];
    }
    _vote(_tokenId, _weight, _poolVote, _weights);
  }

  function _vote(uint256 _tokenId, uint256 _weight, address[] memory _poolVote, uint256[] memory _weights) internal {
    _reset(_tokenId);
    uint256 _poolCnt = _poolVote.length;
    uint256 _totalVoteWeight = 0;
    uint256 _totalWeight = 0;
    uint256 _usedWeight = 0;

    for (uint256 i = 0; i < _poolCnt; i++) {
      _totalVoteWeight += _weights[i];
    }

    for (uint256 i = 0; i < _poolCnt; i++) {
      address _pool = _poolVote[i];
      address _gauge = gauges[_pool];
      if (_gauge == address(0)) revert GaugeDoesNotExist(_pool);
      if (!isAlive[_gauge]) revert GaugeNotAlive(_gauge);

      if (isGauge[_gauge]) {
        uint256 _poolWeight = (_weights[i] * _weight) / _totalVoteWeight;
        if (votes[_tokenId][_pool] != 0) revert NonZeroVotes();
        if (_poolWeight == 0) revert ZeroBalance();
        _updateFor(_gauge);

        poolVote[_tokenId].push(_pool);

        weights[_pool] += _poolWeight;
        votes[_tokenId][_pool] += _poolWeight;
        IReward(gaugeToBribe[_gauge])._deposit(_poolWeight, _tokenId);
        _usedWeight += _poolWeight;
        _totalWeight += _poolWeight;
        emit Voted(_msgSender(), _pool, _tokenId, _poolWeight, weights[_pool], block.timestamp);
      }
    }
    if (_usedWeight > 0) IVotingEscrow(ve).voting(_tokenId, true);
    totalWeight += _totalWeight;
    usedWeights[_tokenId] = _usedWeight;
  }

  /// @inheritdoc IVoter
  function vote(
    uint256 _tokenId,
    address[] calldata _poolVote,
    uint256[] calldata _weights
  ) external onlyNewEpoch(_tokenId) nonReentrant {
    address _sender = _msgSender();
    if (!IVotingEscrow(ve).isApprovedOrOwner(_sender, _tokenId)) revert NotApprovedOrOwner();
    if (_poolVote.length != _weights.length) revert UnequalLengths();
    if (_poolVote.length > maxVotingNum) revert TooManyPools();
    uint256 _timestamp = block.timestamp;
    if ((_timestamp > ProtocolTimeLibrary.epochVoteEnd(_timestamp)) && !isWhitelistedNFT[_tokenId])
      revert NotWhitelistedNFT();
    lastVoted[_tokenId] = _timestamp;
    uint256 _weight = IVotingEscrow(ve).balanceOfNFT(_tokenId);
    _vote(_tokenId, _weight, _poolVote, _weights);
  }

  /// @inheritdoc IVoter
  function whitelistToken(address _token, bool _bool) external {
    if (_msgSender() != governor) revert NotGovernor();
    _whitelistToken(_token, _bool);
  }

  function _whitelistToken(address _token, bool _bool) internal {
    isWhitelistedToken[_token] = _bool;
    emit WhitelistToken(_msgSender(), _token, _bool);
  }

  /// @inheritdoc IVoter
  function whitelistNFT(uint256 _tokenId, bool _bool) external {
    address _sender = _msgSender();
    if (_sender != governor) revert NotGovernor();
    isWhitelistedNFT[_tokenId] = _bool;
    emit WhitelistNFT(_sender, _tokenId, _bool);
  }

  /// @inheritdoc IVoter
  function createGauge(address _poolFactory, address _pool) external nonReentrant returns (address) {
    address sender = _msgSender();
    if (gauges[_pool] != address(0)) revert GaugeExists();

    (address votingRewardsFactory, address gaugeFactory) = IFactoryRegistry(factoryRegistry).factoriesToPoolFactory(
      _poolFactory
    );
    if (sender != governor) {
      if (!isWhitelistedToken[_pool]) revert NotWhitelistedToken();
    }

    address _bribeVotingReward = IVotingRewardsFactory(votingRewardsFactory).createRewards(forwarder, _pool);

    address _gauge = IGaugeFactory(gaugeFactory).createGauge(forwarder, _pool);

    gaugeToBribe[_gauge] = _bribeVotingReward;
    gauges[_pool] = _gauge;
    poolForGauge[_gauge] = _pool;
    isGauge[_gauge] = true;
    isAlive[_gauge] = true;
    _updateFor(_gauge);
    pools.push(_pool);

    emit GaugeCreated(_poolFactory, votingRewardsFactory, gaugeFactory, _pool, _bribeVotingReward, _gauge, sender);
    return _gauge;
  }

  /// @inheritdoc IVoter
  function killGauge(address _gauge) external {
    if (_msgSender() != emergencyCouncil) revert NotEmergencyCouncil();
    if (!isAlive[_gauge]) revert GaugeAlreadyKilled();
    // Return claimable back to valut
    uint256 _claimable = claimable[_gauge];
    if (_claimable > 0) {
      payable(vault).transfer(_claimable);
      delete claimable[_gauge];
    }
    isAlive[_gauge] = false;
    emit GaugeKilled(_gauge);
  }

  /// @inheritdoc IVoter
  function reviveGauge(address _gauge) external {
    if (_msgSender() != emergencyCouncil) revert NotEmergencyCouncil();
    if (isAlive[_gauge]) revert GaugeAlreadyRevived();
    isAlive[_gauge] = true;
    emit GaugeRevived(_gauge);
  }

  /// @inheritdoc IVoter
  function length() external view returns (uint256) {
    return pools.length;
  }

  /// @inheritdoc IVoter
  function notifyRewardAmount() external payable {
    address sender = _msgSender();
    if (sender != vault) revert NotVault();
    uint256 _amount = msg.value;
    uint256 _ratio = (_amount * 1e18) / Math.max(totalWeight, 1); // 1e18 adjustment is removed during claim
    if (_ratio > 0) {
      index += _ratio;
    }
    emit NotifyReward(sender, _amount);
  }

  /// @inheritdoc IVoter
  function updateFor(address[] memory _gauges) external {
    uint256 _length = _gauges.length;
    for (uint256 i = 0; i < _length; i++) {
      _updateFor(_gauges[i]);
    }
  }

  /// @inheritdoc IVoter
  function updateFor(uint256 start, uint256 end) external {
    for (uint256 i = start; i < end; i++) {
      _updateFor(gauges[pools[i]]);
    }
  }

  /// @inheritdoc IVoter
  function updateFor(address _gauge) external {
    _updateFor(_gauge);
  }

  function _updateFor(address _gauge) internal {
    address _pool = poolForGauge[_gauge];
    uint256 _supplied = weights[_pool];
    if (_supplied > 0) {
      uint256 _supplyIndex = supplyIndex[_gauge];
      uint256 _index = index; // get global index0 for accumulated distribution
      supplyIndex[_gauge] = _index; // update _gauge current position to global position
      uint256 _delta = _index - _supplyIndex; // see if there is any difference that need to be accrued
      if (_delta > 0) {
        uint256 _share = (_supplied * _delta) / 1e18; // add accrued difference for each supplied token
        if (isAlive[_gauge]) {
          claimable[_gauge] += _share;
        } else {
          payable(vault).transfer(_share); // send rewards back to Vault so they're not stuck in Voter
        }
      }
    } else {
      supplyIndex[_gauge] = index; // new users are set to the default global state
    }
  }

  /// @inheritdoc IVoter
  function claimRewards(address[] memory _gauges) external {
    uint256 _length = _gauges.length;
    for (uint256 i = 0; i < _length; i++) {
      IGauge(_gauges[i]).getReward(_msgSender());
    }
  }

  /// @inheritdoc IVoter
  function claimBribes(address[] memory _bribes, address[][] memory _tokens, uint256 _tokenId) external {
    if (!IVotingEscrow(ve).isApprovedOrOwner(_msgSender(), _tokenId)) revert NotApprovedOrOwner();
    uint256 _length = _bribes.length;
    for (uint256 i = 0; i < _length; i++) {
      IReward(_bribes[i]).getReward(_tokenId, _tokens[i]);
    }
  }

  function _distribute(address _gauge) internal {
    _updateFor(_gauge); // should set claimable to 0 if killed
    uint256 _claimable = claimable[_gauge];
    if (_claimable > IGauge(_gauge).left() && _claimable > DURATION) {
      claimable[_gauge] = 0;
      IGauge(_gauge).notifyRewardAmount{value: _claimable}();
      emit DistributeReward(_msgSender(), _gauge, _claimable);
    }
  }

  /// @inheritdoc IVoter
  function distribute(uint256 _start, uint256 _finish) external nonReentrant {
    IVault(vault).updatePeriod();
    for (uint256 x = _start; x < _finish; x++) {
      _distribute(gauges[pools[x]]);
    }
  }

  /// @inheritdoc IVoter
  function distribute(address[] memory _gauges) external nonReentrant {
    IVault(vault).updatePeriod();
    uint256 _length = _gauges.length;
    for (uint256 x = 0; x < _length; x++) {
      _distribute(_gauges[x]);
    }
  }
}
