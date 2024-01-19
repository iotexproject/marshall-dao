/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Vault, VaultInterface } from "../../contracts/Vault";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ve",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardsDistributor",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InsufficientFund",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRate",
    type: "error",
  },
  {
    inputs: [],
    name: "NotPendingTeam",
    type: "error",
  },
  {
    inputs: [],
    name: "NotTeam",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroDonation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_newTeam",
        type: "address",
      },
    ],
    name: "AcceptTeam",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Donation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weekly",
        type: "uint256",
      },
    ],
    name: "Emission",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
    ],
    name: "VeRateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "weekly",
        type: "uint256",
      },
    ],
    name: "WeeklyChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipcient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "WEEK",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptTeam",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "activePeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
    ],
    name: "changeVeRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_weekly",
        type: "uint256",
      },
    ],
    name: "changeWeekly",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "epochCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingTeam",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsDistributor",
    outputs: [
      {
        internalType: "contract IRewardsDistributor",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_team",
        type: "address",
      },
    ],
    name: "setTeam",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "team",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "updatePeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "_period",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ve",
    outputs: [
      {
        internalType: "contract IVotingEscrow",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "veRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "voter",
    outputs: [
      {
        internalType: "contract IVoter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "weekly",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_recipcient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60e03461010657601f61092438819003918201601f19168301916001600160401b0383118484101761010b578084926060946040528339810103126101065761004781610121565b61005f604061005860208501610121565b9301610121565b6103e860005569152d02c7e14af68000006001556001600160a01b0391821660805291811660a052600480546001600160a01b031916331790551660c05262093a80428190048082029181159183041417156100f0576002556040516107ee908161013682396080518181816104310152610652015260a051816106f9015260c0518181816103d001526106960152f35b634e487b7160e01b600052601160045260246000fd5b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036101065756fe60806040908082526004908136101561004c575b5050361561002057600080fd5b513481527f5d8bc849764969eb1bcc6d0a2f55999d0167c1ccec240a4f39cf664ca9c4148e60203392a2005b600091823560e01c918263095cf5c61461073c575081630a441f7b1461071d5781631f850716146106d957816326cfc17b146106ba5781633f2a55401461067657816346c96aac1461063257816359d46ffc1461060a5781636a110383146105b0578163829965cc1461059157816385f2aef214610567578163a83627de1461033e578163ada6565e14610321578163b5cc143a1461029b578163ed88c68e1461024b578163f01aea03146101db578163f3fef3a314610138575063f4359ce5146101175780610013565b90346101345781600319360112610134576020905162093a808152f35b5080fd5b839150346101d757816003193601126101d7578035916001600160a01b03918284168094036101d3576024359281541633036101c557508382848282156101bc575b839283928392f1156101b357519081527f9b1bfa7fa9ee420a16e124f794c35ac9f90472acc99140eb2f6447c714cad8eb60203392a380f35b513d84823e3d90fd5b506108fc61017a565b9051633a7cfa5d60e21b8152fd5b8480fd5b8280fd5b905082346101d75760203660031901126101d7578135916001600160a01b0381541633036101c557611388831161023d5750816020917f1b3e838a14abc73095667e9ce064209c4643de8849f0efbf7f4ea8f8a7103f3993855551908152a180f35b9051636a43f8d160e01b8152fd5b839150826003193601126101d757341561028d5750513481527f5d8bc849764969eb1bcc6d0a2f55999d0167c1ccec240a4f39cf664ca9c4148e60203392a280f35b9051636370392160e11b8152fd5b839150346101d757826003193601126101d757600554906001600160a01b038216928333036103145750805473ffffffffffffffffffffffffffffffffffffffff19808216851790925591166005558216177fe25466fe8250322bee73bc230e10775fe0da57be723ebdabfdc8b62b4ba0d10c8280a280f35b5163071110c760e51b8152fd5b828434610134578160031936011261013457602091549051908152f35b905082346101d757826003193601126101d7576002549162093a809081840180851161052057421015610376575b6020848451908152f35b9092506003546000198114610554576001016003558242048381029381850414901517156105415782600255600154908147106105335784548083029083820414831517156105205761271090046001600160a01b0386817f000000000000000000000000000000000000000000000000000000000000000016818482828215610517575b839283928392f11561050b57803b1561013457819085885180948193635f72ee1960e11b83525af18015610501576104ee575b507f000000000000000000000000000000000000000000000000000000000000000016908303918383116104db57908691813b156101d757855180948193630314777960e21b83525af180156104d1576104b9575b506020935081519081527ff54dbf4cddb908bac0d67a3e6d3e4de95d0e7bc059afe2d34b37a6ebbc3879ca843392a2838061036c565b6104c385916107b7565b6104cd5783610483565b8380fd5b83513d87823e3d90fd5b634e487b7160e01b875260119052602486fd5b6104fa909791976107b7565b958761042e565b86513d8a823e3d90fd5b508551903d90823e3d90fd5b506108fc6103fb565b634e487b7160e01b865260118252602486fd5b8251636a259e3160e11b8152fd5b634e487b7160e01b845260119052602483fd5b634e487b7160e01b855260118252602485fd5b83833461058e578060031936011261058e57506001600160a01b0360209254169051908152f35b80fd5b8284346101345781600319360112610134576020906003549051908152f35b905082346101d75760203660031901126101d7578135916001600160a01b0381541633036101c55750816020917f6b7d0eeb50ab9007d612c3d47bc900447594cde214923c1b9d0f2b1fc960ca719360015551908152a180f35b8284346101345781600319360112610134576020906001600160a01b03600554169051908152f35b828434610134578160031936011261013457602090516001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168152f35b828434610134578160031936011261013457602090516001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168152f35b8284346101345781600319360112610134576020906001549051908152f35b828434610134578160031936011261013457602090516001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168152f35b8284346101345781600319360112610134576020906002549051908152f35b915083346104cd5760203660031901126104cd578135926001600160a01b038085168095036107b35783541633036107a55750821561079857505073ffffffffffffffffffffffffffffffffffffffff19600554161760055580f35b5163d92e233d60e01b8152fd5b633a7cfa5d60e21b81529050fd5b8580fd5b67ffffffffffffffff81116107cb57604052565b634e487b7160e01b600052604160045260246000fdfea164736f6c6343000813000a";

type VaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Vault__factory extends ContractFactory {
  constructor(...args: VaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _voter: AddressLike,
    _ve: AddressLike,
    _rewardsDistributor: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _voter,
      _ve,
      _rewardsDistributor,
      overrides || {}
    );
  }
  override deploy(
    _voter: AddressLike,
    _ve: AddressLike,
    _rewardsDistributor: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _voter,
      _ve,
      _rewardsDistributor,
      overrides || {}
    ) as Promise<
      Vault & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Vault__factory {
    return super.connect(runner) as Vault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VaultInterface {
    return new Interface(_abi) as VaultInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Vault {
    return new Contract(address, _abi, runner) as unknown as Vault;
  }
}