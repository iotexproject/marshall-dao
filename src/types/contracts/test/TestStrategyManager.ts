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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface TestStrategyManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "distributeRewards"
      | "recordShares"
      | "rewards"
      | "setShare"
      | "shares"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "distributeRewards",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "recordShares",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rewards",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setShare",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "shares", values: [AddressLike]): string;

  decodeFunctionResult(
    functionFragment: "distributeRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recordShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setShare", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "shares", data: BytesLike): Result;
}

export interface TestStrategyManager extends BaseContract {
  connect(runner?: ContractRunner | null): TestStrategyManager;
  waitForDeployment(): Promise<this>;

  interface: TestStrategyManagerInterface;

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

  distributeRewards: TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [boolean],
    "payable"
  >;

  recordShares: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  rewards: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;

  setShare: TypedContractMethod<
    [_user: AddressLike, _share: BigNumberish],
    [void],
    "nonpayable"
  >;

  shares: TypedContractMethod<[user: AddressLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "distributeRewards"
  ): TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [boolean],
    "payable"
  >;
  getFunction(
    nameOrSignature: "recordShares"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "rewards"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "setShare"
  ): TypedContractMethod<
    [_user: AddressLike, _share: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "shares"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;

  filters: {};
}
