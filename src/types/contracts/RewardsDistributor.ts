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
} from "../common";

export interface RewardsDistributorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "WEEK"
      | "checkpointToken"
      | "claim"
      | "claimMany"
      | "claimable"
      | "lastTokenTime"
      | "minter"
      | "setMinter"
      | "startTime"
      | "timeCursorOf"
      | "tokenLastBalance"
      | "tokensPerWeek"
      | "ve"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "CheckpointToken" | "Claimed"
  ): EventFragment;

  encodeFunctionData(functionFragment: "WEEK", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "checkpointToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "claim", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "claimMany",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "claimable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lastTokenTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "minter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setMinter",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "startTime", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "timeCursorOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenLastBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokensPerWeek",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "ve", values?: undefined): string;

  decodeFunctionResult(functionFragment: "WEEK", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "checkpointToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimMany", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimable", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastTokenTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "minter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setMinter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startTime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "timeCursorOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenLastBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensPerWeek",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ve", data: BytesLike): Result;
}

export namespace CheckpointTokenEvent {
  export type InputTuple = [time: BigNumberish, tokens: BigNumberish];
  export type OutputTuple = [time: bigint, tokens: bigint];
  export interface OutputObject {
    time: bigint;
    tokens: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ClaimedEvent {
  export type InputTuple = [
    tokenId: BigNumberish,
    epochStart: BigNumberish,
    epochEnd: BigNumberish,
    amount: BigNumberish
  ];
  export type OutputTuple = [
    tokenId: bigint,
    epochStart: bigint,
    epochEnd: bigint,
    amount: bigint
  ];
  export interface OutputObject {
    tokenId: bigint;
    epochStart: bigint;
    epochEnd: bigint;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface RewardsDistributor extends BaseContract {
  connect(runner?: ContractRunner | null): RewardsDistributor;
  waitForDeployment(): Promise<this>;

  interface: RewardsDistributorInterface;

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

  WEEK: TypedContractMethod<[], [bigint], "view">;

  checkpointToken: TypedContractMethod<[], [void], "nonpayable">;

  claim: TypedContractMethod<[_tokenId: BigNumberish], [bigint], "nonpayable">;

  claimMany: TypedContractMethod<
    [_tokenIds: BigNumberish[]],
    [boolean],
    "nonpayable"
  >;

  claimable: TypedContractMethod<[_tokenId: BigNumberish], [bigint], "view">;

  lastTokenTime: TypedContractMethod<[], [bigint], "view">;

  minter: TypedContractMethod<[], [string], "view">;

  setMinter: TypedContractMethod<[_minter: AddressLike], [void], "nonpayable">;

  startTime: TypedContractMethod<[], [bigint], "view">;

  timeCursorOf: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  tokenLastBalance: TypedContractMethod<[], [bigint], "view">;

  tokensPerWeek: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  ve: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "WEEK"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "checkpointToken"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "claim"
  ): TypedContractMethod<[_tokenId: BigNumberish], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "claimMany"
  ): TypedContractMethod<[_tokenIds: BigNumberish[]], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "claimable"
  ): TypedContractMethod<[_tokenId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "lastTokenTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "minter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setMinter"
  ): TypedContractMethod<[_minter: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "startTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "timeCursorOf"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "tokenLastBalance"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "tokensPerWeek"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(nameOrSignature: "ve"): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "CheckpointToken"
  ): TypedContractEvent<
    CheckpointTokenEvent.InputTuple,
    CheckpointTokenEvent.OutputTuple,
    CheckpointTokenEvent.OutputObject
  >;
  getEvent(
    key: "Claimed"
  ): TypedContractEvent<
    ClaimedEvent.InputTuple,
    ClaimedEvent.OutputTuple,
    ClaimedEvent.OutputObject
  >;

  filters: {
    "CheckpointToken(uint256,uint256)": TypedContractEvent<
      CheckpointTokenEvent.InputTuple,
      CheckpointTokenEvent.OutputTuple,
      CheckpointTokenEvent.OutputObject
    >;
    CheckpointToken: TypedContractEvent<
      CheckpointTokenEvent.InputTuple,
      CheckpointTokenEvent.OutputTuple,
      CheckpointTokenEvent.OutputObject
    >;

    "Claimed(uint256,uint256,uint256,uint256)": TypedContractEvent<
      ClaimedEvent.InputTuple,
      ClaimedEvent.OutputTuple,
      ClaimedEvent.OutputObject
    >;
    Claimed: TypedContractEvent<
      ClaimedEvent.InputTuple,
      ClaimedEvent.OutputTuple,
      ClaimedEvent.OutputObject
    >;
  };
}
