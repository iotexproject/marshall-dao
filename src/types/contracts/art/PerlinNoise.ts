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

export interface PerlinNoiseInterface extends Interface {
  getFunction(nameOrSignature: "noise2d" | "noise3d"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "noise2d",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "noise3d",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "noise2d", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "noise3d", data: BytesLike): Result;
}

export interface PerlinNoise extends BaseContract {
  connect(runner?: ContractRunner | null): PerlinNoise;
  waitForDeployment(): Promise<this>;

  interface: PerlinNoiseInterface;

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

  noise2d: TypedContractMethod<
    [x: BigNumberish, y: BigNumberish],
    [bigint],
    "view"
  >;

  noise3d: TypedContractMethod<
    [x: BigNumberish, y: BigNumberish, z: BigNumberish],
    [bigint],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "noise2d"
  ): TypedContractMethod<[x: BigNumberish, y: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "noise3d"
  ): TypedContractMethod<
    [x: BigNumberish, y: BigNumberish, z: BigNumberish],
    [bigint],
    "view"
  >;

  filters: {};
}
