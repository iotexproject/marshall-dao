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
} from "../common";

export declare namespace IVeArtProxy {
  export type ConfigStruct = {
    _tokenId: BigNumberish;
    _balanceOf: BigNumberish;
    _lockedEnd: BigNumberish;
    _lockedAmount: BigNumberish;
  };

  export type ConfigStructOutput = [
    _tokenId: bigint,
    _balanceOf: bigint,
    _lockedEnd: bigint,
    _lockedAmount: bigint
  ] & {
    _tokenId: bigint;
    _balanceOf: bigint;
    _lockedEnd: bigint;
    _lockedAmount: bigint;
  };
}

export interface VeArtProxyInterface extends Interface {
  getFunction(
    nameOrSignature: "generateConfig" | "image" | "tokenURI" | "ve"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "generateConfig",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "image", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "ve", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "generateConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "image", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ve", data: BytesLike): Result;
}

export interface VeArtProxy extends BaseContract {
  connect(runner?: ContractRunner | null): VeArtProxy;
  waitForDeployment(): Promise<this>;

  interface: VeArtProxyInterface;

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

  generateConfig: TypedContractMethod<
    [_tokenId: BigNumberish],
    [IVeArtProxy.ConfigStructOutput],
    "view"
  >;

  image: TypedContractMethod<[], [string], "view">;

  tokenURI: TypedContractMethod<[_tokenId: BigNumberish], [string], "view">;

  ve: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "generateConfig"
  ): TypedContractMethod<
    [_tokenId: BigNumberish],
    [IVeArtProxy.ConfigStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "image"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "tokenURI"
  ): TypedContractMethod<[_tokenId: BigNumberish], [string], "view">;
  getFunction(nameOrSignature: "ve"): TypedContractMethod<[], [string], "view">;

  filters: {};
}
