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

export declare namespace IForwarder {
  export type ForwardRequestStruct = {
    from: AddressLike;
    to: AddressLike;
    value: BigNumberish;
    gas: BigNumberish;
    nonce: BigNumberish;
    data: BytesLike;
    validUntilTime: BigNumberish;
  };

  export type ForwardRequestStructOutput = [
    from: string,
    to: string,
    value: bigint,
    gas: bigint,
    nonce: bigint,
    data: string,
    validUntilTime: bigint
  ] & {
    from: string;
    to: string;
    value: bigint;
    gas: bigint;
    nonce: bigint;
    data: string;
    validUntilTime: bigint;
  };
}

export interface DAOForwarderInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "EIP712_DOMAIN_TYPE"
      | "GENERIC_PARAMS"
      | "_getEncoded"
      | "domains"
      | "execute"
      | "getNonce"
      | "registerDomainSeparator"
      | "registerRequestType"
      | "supportsInterface"
      | "typeHashes"
      | "verify"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "DomainRegistered" | "RequestTypeRegistered"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "EIP712_DOMAIN_TYPE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "GENERIC_PARAMS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_getEncoded",
    values: [IForwarder.ForwardRequestStruct, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "domains", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "execute",
    values: [
      IForwarder.ForwardRequestStruct,
      BytesLike,
      BytesLike,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getNonce",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "registerDomainSeparator",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "registerRequestType",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "typeHashes",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "verify",
    values: [
      IForwarder.ForwardRequestStruct,
      BytesLike,
      BytesLike,
      BytesLike,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "EIP712_DOMAIN_TYPE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "GENERIC_PARAMS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_getEncoded",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "domains", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getNonce", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerDomainSeparator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerRequestType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "typeHashes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "verify", data: BytesLike): Result;
}

export namespace DomainRegisteredEvent {
  export type InputTuple = [domainSeparator: BytesLike, domainValue: BytesLike];
  export type OutputTuple = [domainSeparator: string, domainValue: string];
  export interface OutputObject {
    domainSeparator: string;
    domainValue: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RequestTypeRegisteredEvent {
  export type InputTuple = [typeHash: BytesLike, typeStr: string];
  export type OutputTuple = [typeHash: string, typeStr: string];
  export interface OutputObject {
    typeHash: string;
    typeStr: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DAOForwarder extends BaseContract {
  connect(runner?: ContractRunner | null): DAOForwarder;
  waitForDeployment(): Promise<this>;

  interface: DAOForwarderInterface;

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

  EIP712_DOMAIN_TYPE: TypedContractMethod<[], [string], "view">;

  GENERIC_PARAMS: TypedContractMethod<[], [string], "view">;

  _getEncoded: TypedContractMethod<
    [
      req: IForwarder.ForwardRequestStruct,
      requestTypeHash: BytesLike,
      suffixData: BytesLike
    ],
    [string],
    "view"
  >;

  domains: TypedContractMethod<[arg0: BytesLike], [boolean], "view">;

  execute: TypedContractMethod<
    [
      req: IForwarder.ForwardRequestStruct,
      domainSeparator: BytesLike,
      requestTypeHash: BytesLike,
      suffixData: BytesLike,
      sig: BytesLike
    ],
    [[boolean, string] & { success: boolean; ret: string }],
    "payable"
  >;

  getNonce: TypedContractMethod<[from: AddressLike], [bigint], "view">;

  registerDomainSeparator: TypedContractMethod<
    [name: string, version: string],
    [void],
    "nonpayable"
  >;

  registerRequestType: TypedContractMethod<
    [typeName: string, typeSuffix: string],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  typeHashes: TypedContractMethod<[arg0: BytesLike], [boolean], "view">;

  verify: TypedContractMethod<
    [
      req: IForwarder.ForwardRequestStruct,
      domainSeparator: BytesLike,
      requestTypeHash: BytesLike,
      suffixData: BytesLike,
      sig: BytesLike
    ],
    [void],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "EIP712_DOMAIN_TYPE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "GENERIC_PARAMS"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "_getEncoded"
  ): TypedContractMethod<
    [
      req: IForwarder.ForwardRequestStruct,
      requestTypeHash: BytesLike,
      suffixData: BytesLike
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "domains"
  ): TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "execute"
  ): TypedContractMethod<
    [
      req: IForwarder.ForwardRequestStruct,
      domainSeparator: BytesLike,
      requestTypeHash: BytesLike,
      suffixData: BytesLike,
      sig: BytesLike
    ],
    [[boolean, string] & { success: boolean; ret: string }],
    "payable"
  >;
  getFunction(
    nameOrSignature: "getNonce"
  ): TypedContractMethod<[from: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "registerDomainSeparator"
  ): TypedContractMethod<[name: string, version: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "registerRequestType"
  ): TypedContractMethod<
    [typeName: string, typeSuffix: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "typeHashes"
  ): TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "verify"
  ): TypedContractMethod<
    [
      req: IForwarder.ForwardRequestStruct,
      domainSeparator: BytesLike,
      requestTypeHash: BytesLike,
      suffixData: BytesLike,
      sig: BytesLike
    ],
    [void],
    "view"
  >;

  getEvent(
    key: "DomainRegistered"
  ): TypedContractEvent<
    DomainRegisteredEvent.InputTuple,
    DomainRegisteredEvent.OutputTuple,
    DomainRegisteredEvent.OutputObject
  >;
  getEvent(
    key: "RequestTypeRegistered"
  ): TypedContractEvent<
    RequestTypeRegisteredEvent.InputTuple,
    RequestTypeRegisteredEvent.OutputTuple,
    RequestTypeRegisteredEvent.OutputObject
  >;

  filters: {
    "DomainRegistered(bytes32,bytes)": TypedContractEvent<
      DomainRegisteredEvent.InputTuple,
      DomainRegisteredEvent.OutputTuple,
      DomainRegisteredEvent.OutputObject
    >;
    DomainRegistered: TypedContractEvent<
      DomainRegisteredEvent.InputTuple,
      DomainRegisteredEvent.OutputTuple,
      DomainRegisteredEvent.OutputObject
    >;

    "RequestTypeRegistered(bytes32,string)": TypedContractEvent<
      RequestTypeRegisteredEvent.InputTuple,
      RequestTypeRegisteredEvent.OutputTuple,
      RequestTypeRegisteredEvent.OutputObject
    >;
    RequestTypeRegistered: TypedContractEvent<
      RequestTypeRegisteredEvent.InputTuple,
      RequestTypeRegisteredEvent.OutputTuple,
      RequestTypeRegisteredEvent.OutputObject
    >;
  };
}
