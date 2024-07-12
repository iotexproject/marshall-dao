/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IVoterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "claimRewards"
      | "claimable"
      | "createGauge"
      | "distribute(address[])"
      | "distribute(uint256,uint256)"
      | "emergencyCouncil"
      | "factoryRegistry"
      | "forwarder"
      | "gauges"
      | "governor"
      | "isAlive"
      | "isGauge"
      | "isWhitelistedToken"
      | "killGauge"
      | "lastVoted"
      | "length"
      | "maxVotingNum"
      | "notifyRewardAmount"
      | "poke()"
      | "poke(address)"
      | "poolForGauge"
      | "reset"
      | "reviveGauge"
      | "setEmergencyCouncil"
      | "setGovernor"
      | "setMaxVotingNum"
      | "strategyManager"
      | "team"
      | "totalWeight"
      | "updateFor(address)"
      | "updateFor(uint256,uint256)"
      | "updateFor(address[])"
      | "usedWeights"
      | "vault"
      | "vote"
      | "votes"
      | "weights"
      | "whitelistToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Abstained"
      | "DistributeReward"
      | "GaugeCreated"
      | "GaugeKilled"
      | "GaugeRevived"
      | "NotifyReward"
      | "UpdateFor"
      | "Voted"
      | "WhitelistToken"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "claimRewards",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "claimable",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createGauge",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "distribute(address[])",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "distribute(uint256,uint256)",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "emergencyCouncil",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "factoryRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "forwarder", values?: undefined): string;
  encodeFunctionData(functionFragment: "gauges", values: [AddressLike]): string;
  encodeFunctionData(functionFragment: "governor", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isAlive",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isGauge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelistedToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "killGauge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lastVoted",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "length", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "maxVotingNum",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "notifyRewardAmount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "poke()", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "poke(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "poolForGauge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "reset", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "reviveGauge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setEmergencyCouncil",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setGovernor",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxVotingNum",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "strategyManager",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "team", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalWeight",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateFor(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateFor(uint256,uint256)",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateFor(address[])",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "usedWeights",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "vote",
    values: [AddressLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "votes",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "weights",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistToken",
    values: [AddressLike, boolean]
  ): string;

  decodeFunctionResult(
    functionFragment: "claimRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimable", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createGauge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distribute(address[])",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distribute(uint256,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "emergencyCouncil",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "factoryRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "forwarder", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gauges", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "governor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isAlive", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isGauge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelistedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "killGauge", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lastVoted", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "length", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxVotingNum",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "notifyRewardAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "poke()", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "poke(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "poolForGauge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "reset", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "reviveGauge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEmergencyCouncil",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setGovernor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxVotingNum",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "strategyManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "team", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalWeight",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateFor(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateFor(uint256,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateFor(address[])",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "usedWeights",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "votes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "weights", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "whitelistToken",
    data: BytesLike
  ): Result;
}

export namespace AbstainedEvent {
  export type InputTuple = [
    voter: AddressLike,
    pool: AddressLike,
    weight: BigNumberish,
    totalWeight: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    voter: string,
    pool: string,
    weight: bigint,
    totalWeight: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    voter: string;
    pool: string;
    weight: bigint;
    totalWeight: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DistributeRewardEvent {
  export type InputTuple = [
    sender: AddressLike,
    gauge: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [sender: string, gauge: string, amount: bigint];
  export interface OutputObject {
    sender: string;
    gauge: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GaugeCreatedEvent {
  export type InputTuple = [
    poolFactory: AddressLike,
    gaugeFactory: AddressLike,
    pool: AddressLike,
    gauge: AddressLike,
    creator: AddressLike
  ];
  export type OutputTuple = [
    poolFactory: string,
    gaugeFactory: string,
    pool: string,
    gauge: string,
    creator: string
  ];
  export interface OutputObject {
    poolFactory: string;
    gaugeFactory: string;
    pool: string;
    gauge: string;
    creator: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GaugeKilledEvent {
  export type InputTuple = [gauge: AddressLike];
  export type OutputTuple = [gauge: string];
  export interface OutputObject {
    gauge: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GaugeRevivedEvent {
  export type InputTuple = [gauge: AddressLike];
  export type OutputTuple = [gauge: string];
  export interface OutputObject {
    gauge: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NotifyRewardEvent {
  export type InputTuple = [sender: AddressLike, amount: BigNumberish];
  export type OutputTuple = [sender: string, amount: bigint];
  export interface OutputObject {
    sender: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateForEvent {
  export type InputTuple = [
    gauge: AddressLike,
    share: BigNumberish,
    delta: BigNumberish
  ];
  export type OutputTuple = [gauge: string, share: bigint, delta: bigint];
  export interface OutputObject {
    gauge: string;
    share: bigint;
    delta: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace VotedEvent {
  export type InputTuple = [
    voter: AddressLike,
    pool: AddressLike,
    weight: BigNumberish,
    totalWeight: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    voter: string,
    pool: string,
    weight: bigint,
    totalWeight: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    voter: string;
    pool: string;
    weight: bigint;
    totalWeight: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WhitelistTokenEvent {
  export type InputTuple = [
    whitelister: AddressLike,
    token: AddressLike,
    _bool: boolean
  ];
  export type OutputTuple = [
    whitelister: string,
    token: string,
    _bool: boolean
  ];
  export interface OutputObject {
    whitelister: string;
    token: string;
    _bool: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IVoter extends BaseContract {
  connect(runner?: ContractRunner | null): IVoter;
  waitForDeployment(): Promise<this>;

  interface: IVoterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  claimRewards: TypedContractMethod<
    [_gauges: AddressLike[]],
    [void],
    "nonpayable"
  >;

  claimable: TypedContractMethod<[gauge: AddressLike], [bigint], "view">;

  createGauge: TypedContractMethod<
    [_poolFactory: AddressLike, _pool: AddressLike],
    [string],
    "nonpayable"
  >;

  "distribute(address[])": TypedContractMethod<
    [_gauges: AddressLike[]],
    [void],
    "nonpayable"
  >;

  "distribute(uint256,uint256)": TypedContractMethod<
    [_start: BigNumberish, _finish: BigNumberish],
    [void],
    "nonpayable"
  >;

  emergencyCouncil: TypedContractMethod<[], [string], "view">;

  factoryRegistry: TypedContractMethod<[], [string], "view">;

  forwarder: TypedContractMethod<[], [string], "view">;

  gauges: TypedContractMethod<[pool: AddressLike], [string], "view">;

  governor: TypedContractMethod<[], [string], "view">;

  isAlive: TypedContractMethod<[gauge: AddressLike], [boolean], "view">;

  isGauge: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  isWhitelistedToken: TypedContractMethod<
    [token: AddressLike],
    [boolean],
    "view"
  >;

  killGauge: TypedContractMethod<[_gauge: AddressLike], [void], "nonpayable">;

  lastVoted: TypedContractMethod<[user: AddressLike], [bigint], "view">;

  length: TypedContractMethod<[], [bigint], "view">;

  maxVotingNum: TypedContractMethod<[], [bigint], "view">;

  notifyRewardAmount: TypedContractMethod<[], [void], "payable">;

  "poke()": TypedContractMethod<[], [void], "nonpayable">;

  "poke(address)": TypedContractMethod<
    [_user: AddressLike],
    [void],
    "nonpayable"
  >;

  poolForGauge: TypedContractMethod<[gauge: AddressLike], [string], "view">;

  reset: TypedContractMethod<[], [void], "nonpayable">;

  reviveGauge: TypedContractMethod<[_gauge: AddressLike], [void], "nonpayable">;

  setEmergencyCouncil: TypedContractMethod<
    [_emergencyCouncil: AddressLike],
    [void],
    "nonpayable"
  >;

  setGovernor: TypedContractMethod<
    [_governor: AddressLike],
    [void],
    "nonpayable"
  >;

  setMaxVotingNum: TypedContractMethod<
    [_maxVotingNum: BigNumberish],
    [void],
    "nonpayable"
  >;

  strategyManager: TypedContractMethod<[], [string], "view">;

  team: TypedContractMethod<[], [string], "view">;

  totalWeight: TypedContractMethod<[], [bigint], "view">;

  "updateFor(address)": TypedContractMethod<
    [_gauge: AddressLike],
    [void],
    "nonpayable"
  >;

  "updateFor(uint256,uint256)": TypedContractMethod<
    [_start: BigNumberish, _end: BigNumberish],
    [void],
    "nonpayable"
  >;

  "updateFor(address[])": TypedContractMethod<
    [_gauges: AddressLike[]],
    [void],
    "nonpayable"
  >;

  usedWeights: TypedContractMethod<[user: AddressLike], [bigint], "view">;

  vault: TypedContractMethod<[], [string], "view">;

  vote: TypedContractMethod<
    [_poolVote: AddressLike[], _weights: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  votes: TypedContractMethod<
    [user: AddressLike, pool: AddressLike],
    [bigint],
    "view"
  >;

  weights: TypedContractMethod<[pool: AddressLike], [bigint], "view">;

  whitelistToken: TypedContractMethod<
    [_token: AddressLike, _bool: boolean],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "claimRewards"
  ): TypedContractMethod<[_gauges: AddressLike[]], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "claimable"
  ): TypedContractMethod<[gauge: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "createGauge"
  ): TypedContractMethod<
    [_poolFactory: AddressLike, _pool: AddressLike],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "distribute(address[])"
  ): TypedContractMethod<[_gauges: AddressLike[]], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "distribute(uint256,uint256)"
  ): TypedContractMethod<
    [_start: BigNumberish, _finish: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "emergencyCouncil"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "factoryRegistry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "forwarder"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "gauges"
  ): TypedContractMethod<[pool: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "governor"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "isAlive"
  ): TypedContractMethod<[gauge: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isGauge"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isWhitelistedToken"
  ): TypedContractMethod<[token: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "killGauge"
  ): TypedContractMethod<[_gauge: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "lastVoted"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "length"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxVotingNum"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "notifyRewardAmount"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "poke()"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "poke(address)"
  ): TypedContractMethod<[_user: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "poolForGauge"
  ): TypedContractMethod<[gauge: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "reset"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "reviveGauge"
  ): TypedContractMethod<[_gauge: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setEmergencyCouncil"
  ): TypedContractMethod<
    [_emergencyCouncil: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setGovernor"
  ): TypedContractMethod<[_governor: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setMaxVotingNum"
  ): TypedContractMethod<[_maxVotingNum: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "strategyManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "team"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalWeight"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "updateFor(address)"
  ): TypedContractMethod<[_gauge: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateFor(uint256,uint256)"
  ): TypedContractMethod<
    [_start: BigNumberish, _end: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateFor(address[])"
  ): TypedContractMethod<[_gauges: AddressLike[]], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "usedWeights"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "vault"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "vote"
  ): TypedContractMethod<
    [_poolVote: AddressLike[], _weights: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "votes"
  ): TypedContractMethod<
    [user: AddressLike, pool: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "weights"
  ): TypedContractMethod<[pool: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "whitelistToken"
  ): TypedContractMethod<
    [_token: AddressLike, _bool: boolean],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Abstained"
  ): TypedContractEvent<
    AbstainedEvent.InputTuple,
    AbstainedEvent.OutputTuple,
    AbstainedEvent.OutputObject
  >;
  getEvent(
    key: "DistributeReward"
  ): TypedContractEvent<
    DistributeRewardEvent.InputTuple,
    DistributeRewardEvent.OutputTuple,
    DistributeRewardEvent.OutputObject
  >;
  getEvent(
    key: "GaugeCreated"
  ): TypedContractEvent<
    GaugeCreatedEvent.InputTuple,
    GaugeCreatedEvent.OutputTuple,
    GaugeCreatedEvent.OutputObject
  >;
  getEvent(
    key: "GaugeKilled"
  ): TypedContractEvent<
    GaugeKilledEvent.InputTuple,
    GaugeKilledEvent.OutputTuple,
    GaugeKilledEvent.OutputObject
  >;
  getEvent(
    key: "GaugeRevived"
  ): TypedContractEvent<
    GaugeRevivedEvent.InputTuple,
    GaugeRevivedEvent.OutputTuple,
    GaugeRevivedEvent.OutputObject
  >;
  getEvent(
    key: "NotifyReward"
  ): TypedContractEvent<
    NotifyRewardEvent.InputTuple,
    NotifyRewardEvent.OutputTuple,
    NotifyRewardEvent.OutputObject
  >;
  getEvent(
    key: "UpdateFor"
  ): TypedContractEvent<
    UpdateForEvent.InputTuple,
    UpdateForEvent.OutputTuple,
    UpdateForEvent.OutputObject
  >;
  getEvent(
    key: "Voted"
  ): TypedContractEvent<
    VotedEvent.InputTuple,
    VotedEvent.OutputTuple,
    VotedEvent.OutputObject
  >;
  getEvent(
    key: "WhitelistToken"
  ): TypedContractEvent<
    WhitelistTokenEvent.InputTuple,
    WhitelistTokenEvent.OutputTuple,
    WhitelistTokenEvent.OutputObject
  >;

  filters: {
    "Abstained(address,address,uint256,uint256,uint256)": TypedContractEvent<
      AbstainedEvent.InputTuple,
      AbstainedEvent.OutputTuple,
      AbstainedEvent.OutputObject
    >;
    Abstained: TypedContractEvent<
      AbstainedEvent.InputTuple,
      AbstainedEvent.OutputTuple,
      AbstainedEvent.OutputObject
    >;

    "DistributeReward(address,address,uint256)": TypedContractEvent<
      DistributeRewardEvent.InputTuple,
      DistributeRewardEvent.OutputTuple,
      DistributeRewardEvent.OutputObject
    >;
    DistributeReward: TypedContractEvent<
      DistributeRewardEvent.InputTuple,
      DistributeRewardEvent.OutputTuple,
      DistributeRewardEvent.OutputObject
    >;

    "GaugeCreated(address,address,address,address,address)": TypedContractEvent<
      GaugeCreatedEvent.InputTuple,
      GaugeCreatedEvent.OutputTuple,
      GaugeCreatedEvent.OutputObject
    >;
    GaugeCreated: TypedContractEvent<
      GaugeCreatedEvent.InputTuple,
      GaugeCreatedEvent.OutputTuple,
      GaugeCreatedEvent.OutputObject
    >;

    "GaugeKilled(address)": TypedContractEvent<
      GaugeKilledEvent.InputTuple,
      GaugeKilledEvent.OutputTuple,
      GaugeKilledEvent.OutputObject
    >;
    GaugeKilled: TypedContractEvent<
      GaugeKilledEvent.InputTuple,
      GaugeKilledEvent.OutputTuple,
      GaugeKilledEvent.OutputObject
    >;

    "GaugeRevived(address)": TypedContractEvent<
      GaugeRevivedEvent.InputTuple,
      GaugeRevivedEvent.OutputTuple,
      GaugeRevivedEvent.OutputObject
    >;
    GaugeRevived: TypedContractEvent<
      GaugeRevivedEvent.InputTuple,
      GaugeRevivedEvent.OutputTuple,
      GaugeRevivedEvent.OutputObject
    >;

    "NotifyReward(address,uint256)": TypedContractEvent<
      NotifyRewardEvent.InputTuple,
      NotifyRewardEvent.OutputTuple,
      NotifyRewardEvent.OutputObject
    >;
    NotifyReward: TypedContractEvent<
      NotifyRewardEvent.InputTuple,
      NotifyRewardEvent.OutputTuple,
      NotifyRewardEvent.OutputObject
    >;

    "UpdateFor(address,uint256,uint256)": TypedContractEvent<
      UpdateForEvent.InputTuple,
      UpdateForEvent.OutputTuple,
      UpdateForEvent.OutputObject
    >;
    UpdateFor: TypedContractEvent<
      UpdateForEvent.InputTuple,
      UpdateForEvent.OutputTuple,
      UpdateForEvent.OutputObject
    >;

    "Voted(address,address,uint256,uint256,uint256)": TypedContractEvent<
      VotedEvent.InputTuple,
      VotedEvent.OutputTuple,
      VotedEvent.OutputObject
    >;
    Voted: TypedContractEvent<
      VotedEvent.InputTuple,
      VotedEvent.OutputTuple,
      VotedEvent.OutputObject
    >;

    "WhitelistToken(address,address,bool)": TypedContractEvent<
      WhitelistTokenEvent.InputTuple,
      WhitelistTokenEvent.OutputTuple,
      WhitelistTokenEvent.OutputObject
    >;
    WhitelistToken: TypedContractEvent<
      WhitelistTokenEvent.InputTuple,
      WhitelistTokenEvent.OutputTuple,
      WhitelistTokenEvent.OutputObject
    >;
  };
}
