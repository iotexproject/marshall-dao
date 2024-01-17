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

export interface MinterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "WEEK"
      | "acceptTeam"
      | "activePeriod"
      | "changeVeRate"
      | "changeWeekly"
      | "donate"
      | "epochCount"
      | "pendingTeam"
      | "rewardsDistributor"
      | "setTeam"
      | "team"
      | "updatePeriod"
      | "ve"
      | "veRate"
      | "voter"
      | "weekly"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AcceptTeam"
      | "Donation"
      | "Mint"
      | "VeRateChanged"
      | "WeeklyChanged"
  ): EventFragment;

  encodeFunctionData(functionFragment: "WEEK", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "acceptTeam",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "activePeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "changeVeRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "changeWeekly",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "donate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "epochCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pendingTeam",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsDistributor",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setTeam",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "team", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "updatePeriod",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "ve", values?: undefined): string;
  encodeFunctionData(functionFragment: "veRate", values?: undefined): string;
  encodeFunctionData(functionFragment: "voter", values?: undefined): string;
  encodeFunctionData(functionFragment: "weekly", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "WEEK", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "acceptTeam", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "activePeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeVeRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeWeekly",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "donate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "epochCount", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingTeam",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardsDistributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setTeam", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "team", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updatePeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "veRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "voter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "weekly", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace AcceptTeamEvent {
  export type InputTuple = [_newTeam: AddressLike];
  export type OutputTuple = [_newTeam: string];
  export interface OutputObject {
    _newTeam: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DonationEvent {
  export type InputTuple = [donor: AddressLike, amount: BigNumberish];
  export type OutputTuple = [donor: string, amount: bigint];
  export interface OutputObject {
    donor: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintEvent {
  export type InputTuple = [sender: AddressLike, weekly: BigNumberish];
  export type OutputTuple = [sender: string, weekly: bigint];
  export interface OutputObject {
    sender: string;
    weekly: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace VeRateChangedEvent {
  export type InputTuple = [rate: BigNumberish];
  export type OutputTuple = [rate: bigint];
  export interface OutputObject {
    rate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WeeklyChangedEvent {
  export type InputTuple = [weekly: BigNumberish];
  export type OutputTuple = [weekly: bigint];
  export interface OutputObject {
    weekly: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Minter extends BaseContract {
  connect(runner?: ContractRunner | null): Minter;
  waitForDeployment(): Promise<this>;

  interface: MinterInterface;

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

  acceptTeam: TypedContractMethod<[], [void], "nonpayable">;

  activePeriod: TypedContractMethod<[], [bigint], "view">;

  changeVeRate: TypedContractMethod<
    [_rate: BigNumberish],
    [void],
    "nonpayable"
  >;

  changeWeekly: TypedContractMethod<
    [_weekly: BigNumberish],
    [void],
    "nonpayable"
  >;

  donate: TypedContractMethod<[], [void], "payable">;

  epochCount: TypedContractMethod<[], [bigint], "view">;

  pendingTeam: TypedContractMethod<[], [string], "view">;

  rewardsDistributor: TypedContractMethod<[], [string], "view">;

  setTeam: TypedContractMethod<[_team: AddressLike], [void], "nonpayable">;

  team: TypedContractMethod<[], [string], "view">;

  updatePeriod: TypedContractMethod<[], [bigint], "nonpayable">;

  ve: TypedContractMethod<[], [string], "view">;

  veRate: TypedContractMethod<[], [bigint], "view">;

  voter: TypedContractMethod<[], [string], "view">;

  weekly: TypedContractMethod<[], [bigint], "view">;

  withdraw: TypedContractMethod<
    [_recipcient: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "WEEK"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "acceptTeam"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "activePeriod"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "changeVeRate"
  ): TypedContractMethod<[_rate: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "changeWeekly"
  ): TypedContractMethod<[_weekly: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "donate"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "epochCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "pendingTeam"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "rewardsDistributor"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setTeam"
  ): TypedContractMethod<[_team: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "team"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "updatePeriod"
  ): TypedContractMethod<[], [bigint], "nonpayable">;
  getFunction(nameOrSignature: "ve"): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "veRate"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "voter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "weekly"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [_recipcient: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "AcceptTeam"
  ): TypedContractEvent<
    AcceptTeamEvent.InputTuple,
    AcceptTeamEvent.OutputTuple,
    AcceptTeamEvent.OutputObject
  >;
  getEvent(
    key: "Donation"
  ): TypedContractEvent<
    DonationEvent.InputTuple,
    DonationEvent.OutputTuple,
    DonationEvent.OutputObject
  >;
  getEvent(
    key: "Mint"
  ): TypedContractEvent<
    MintEvent.InputTuple,
    MintEvent.OutputTuple,
    MintEvent.OutputObject
  >;
  getEvent(
    key: "VeRateChanged"
  ): TypedContractEvent<
    VeRateChangedEvent.InputTuple,
    VeRateChangedEvent.OutputTuple,
    VeRateChangedEvent.OutputObject
  >;
  getEvent(
    key: "WeeklyChanged"
  ): TypedContractEvent<
    WeeklyChangedEvent.InputTuple,
    WeeklyChangedEvent.OutputTuple,
    WeeklyChangedEvent.OutputObject
  >;

  filters: {
    "AcceptTeam(address)": TypedContractEvent<
      AcceptTeamEvent.InputTuple,
      AcceptTeamEvent.OutputTuple,
      AcceptTeamEvent.OutputObject
    >;
    AcceptTeam: TypedContractEvent<
      AcceptTeamEvent.InputTuple,
      AcceptTeamEvent.OutputTuple,
      AcceptTeamEvent.OutputObject
    >;

    "Donation(address,uint256)": TypedContractEvent<
      DonationEvent.InputTuple,
      DonationEvent.OutputTuple,
      DonationEvent.OutputObject
    >;
    Donation: TypedContractEvent<
      DonationEvent.InputTuple,
      DonationEvent.OutputTuple,
      DonationEvent.OutputObject
    >;

    "Mint(address,uint256)": TypedContractEvent<
      MintEvent.InputTuple,
      MintEvent.OutputTuple,
      MintEvent.OutputObject
    >;
    Mint: TypedContractEvent<
      MintEvent.InputTuple,
      MintEvent.OutputTuple,
      MintEvent.OutputObject
    >;

    "VeRateChanged(uint256)": TypedContractEvent<
      VeRateChangedEvent.InputTuple,
      VeRateChangedEvent.OutputTuple,
      VeRateChangedEvent.OutputObject
    >;
    VeRateChanged: TypedContractEvent<
      VeRateChangedEvent.InputTuple,
      VeRateChangedEvent.OutputTuple,
      VeRateChangedEvent.OutputObject
    >;

    "WeeklyChanged(uint256)": TypedContractEvent<
      WeeklyChangedEvent.InputTuple,
      WeeklyChangedEvent.OutputTuple,
      WeeklyChangedEvent.OutputObject
    >;
    WeeklyChanged: TypedContractEvent<
      WeeklyChangedEvent.InputTuple,
      WeeklyChangedEvent.OutputTuple,
      WeeklyChangedEvent.OutputObject
    >;
  };
}
