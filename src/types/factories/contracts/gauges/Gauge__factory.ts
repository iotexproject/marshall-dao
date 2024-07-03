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
import type { NonPayableOverrides } from "../../../common";
import type { Gauge, GaugeInterface } from "../../../contracts/gauges/Gauge";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_forwarder",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stakingToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "NotAlive",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "NotTeam",
    type: "error",
  },
  {
    inputs: [],
    name: "NotVoter",
    type: "error",
  },
  {
    inputs: [],
    name: "RewardRateTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroRewardRate",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ClaimRewards",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "NotifyReward",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "earned",
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
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastTimeRewardApplicable",
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
    name: "lastUpdateTime",
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
    name: "left",
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
    name: "notifyRewardAmount",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "notifyRewardWithoutClaim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "periodFinish",
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
    name: "rewardPerToken",
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
    name: "rewardPerTokenStored",
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
    name: "rewardRate",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "rewardRateByEpoch",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "rewards",
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
    name: "stakingToken",
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
    name: "totalSupply",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userRewardPerTokenPaid",
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
        internalType: "address",
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
] as const;

const _bytecode =
  "0x60e0346100d857601f6111ac38819003918201601f19168301916001600160401b038311848410176100dd578084926060946040528339810103126100d857610047816100f3565b906100606040610059602084016100f3565b92016100f3565b91608052600160005560a05260c0526040516110a4908161010882396080518181816107470152610c4b015260a0518181816103c6015281816105270152818161068a0152610974015260c0518181816102a701528181610321015281816105e601528181610783015281816107ee0152610a1c0152f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036100d85756fe6040608081526004908136101561001557600080fd5b600091823560e01c9081628cc26214610a9b5781630700037d14610a635781630c51dde4146109f457816316e64048146109d757816318160ddd146109b85781632e1a7d4d146108a95781633506c729146107b257816346c96aac1461076e578163572b6c051461071c5781636e553f651461058e57816370a082311461055657816372f702f3146105125781637b0a47ee146104f357816380faa57d146104d65781638b8763471461049e57816394af5b6314610476578163b6b55f25146102d2578163c00007b01461019a578163c8f33c911461017b578163cd3daf9d14610157578163df136d6514610135575063ebe2b12b1461011457600080fd5b346101315781600319360112610131576020906001549051908152f35b5080fd5b90503461015357826003193601126101535760209250549051908152f35b8280fd5b505034610131578160031936011261013157602090610174610b3f565b9051908152f35b5050346101315781600319360112610131576020906003549051908152f35b905034610153576020366003190112610153576101b5610ac1565b916101be610ca1565b6101c6610c48565b6001600160a01b03808516949181168086141591826102a5575b5050610297576101ef90610f37565b828452600860205280842091848354938461020d575b506001815580f35b558480808086885af161021e610c08565b501561025a57507f1f89f96333d3133000ee447473151fa9606543368f02271c9d95ae14f13bcc679160209151908152a2388080808481610205565b6020606492519162461bcd60e51b835282015260186024820152773a3930b739b332b9103932bbb0b93239903330b4b632b21760411b6044820152fd5b505163ea8e4eb560e01b8152fd5b7f0000000000000000000000000000000000000000000000000000000000000000161415905038806101e0565b905034610153576020806003193601126104725781356102f0610c48565b926102f9610ca1565b8115610464578451631703e5f960e01b815230828201526001600160a01b03919084816024817f000000000000000000000000000000000000000000000000000000000000000087165afa90811561045a57889161042d575b501561041f5750907f5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f629291610385610c48565b9461038f81610f37565b6103eb828851976323b872dd60e01b878a01521696876024820152306044820152846064820152606481526103c381610bb4565b837f000000000000000000000000000000000000000000000000000000000000000016610d6b565b6103f783600554610b32565b600555169485875260068352808720610411838254610b32565b905551908152a36001815580f35b85516310f3d9c960e01b8152fd5b61044d9150853d8711610453575b6104458183610be6565b810190610d53565b38610352565b503d61043b565b87513d8a823e3d90fd5b8451631f2a200560e01b8152fd5b8380fd5b9050346101535760203660031901126101535760209282913581526009845220549051908152f35b5050346101315760203660031901126101315760209181906001600160a01b036104c6610ac1565b1681526007845220549051908152f35b505034610131578160031936011261013157602090610174610ba2565b5050346101315781600319360112610131576020906002549051908152f35b505034610131578160031936011261013157517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b5050346101315760203660031901126101315760209181906001600160a01b0361057e610ac1565b1681526006845220549051908152f35b919050346101535780600319360112610153576001600160a01b03602435818116939192823591858103610718576105c4610ca1565b8215610708578151631703e5f960e01b815230858201526020949085816024817f00000000000000000000000000000000000000000000000000000000000000008b165afa9081156106fe5789916106e1575b50156106d35750906106af7f5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62949392610657610651610c48565b91610f37565b868351916323b872dd60e01b8784015216968760248301523060448301528460648301526064825261068882610bb4565b7f000000000000000000000000000000000000000000000000000000000000000016610d6b565b6106bb82600554610b32565b60055585875260068352808720610411838254610b32565b82516310f3d9c960e01b8152fd5b6106f89150863d8811610453576104458183610be6565b38610617565b84513d8b823e3d90fd5b8151631f2a200560e01b81528490fd5b8680fd5b5050346101315760203660031901126101315760209061073a610ac1565b90519060018060a01b03807f0000000000000000000000000000000000000000000000000000000000000000169116148152f35b505034610131578160031936011261013157517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b905082600319360112610153576107c7610ca1565b6107cf610c48565b82516342f9577960e11b81529092906001600160a01b039060208185817f000000000000000000000000000000000000000000000000000000000000000086165afa90811561089f57908291879161085e575b501690841603610851573415610844578361083d3485610f9c565b6001815580f35b51631f2a200560e01b8152fd5b51633a7cfa5d60e21b8152fd5b9150506020813d8211610897575b8161087960209383610be6565b810103126108935751818116810361089357819038610822565b8580fd5b3d915061086c565b83513d88823e3d90fd5b91905034610153576020366003190112610153578135906108c8610ca1565b6108d0610c48565b926108da84610f37565b6108e683600554610adc565b60055560018060a01b0380941693848652600660205282862061090a858254610adc565b905582519163a9059cbb60e01b602084015285602484015284604484015260448352608083019083821067ffffffffffffffff8311176109a557507f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a94243649492849261099992602096527f000000000000000000000000000000000000000000000000000000000000000016610d6b565b51908152a26001815580f35b634e487b7160e01b885260419052602487fd5b5050346101315781600319360112610131576020906005549051908152f35b505034610131578160031936011261013157602090610174610f7d565b90508260031936011261015357610a09610ca1565b610a11610c48565b916001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811690841603610a56573415610844578361083d3485610f9c565b5163c18384c160e01b8152fd5b5050346101315760203660031901126101315760209181906001600160a01b03610a8b610ac1565b1681526008845220549051908152f35b50503461013157602036600319011261013157602090610174610abc610ac1565b610cf7565b600435906001600160a01b0382168203610ad757565b600080fd5b91908203918211610ae957565b634e487b7160e01b600052601160045260246000fd5b81810292918115918404141715610ae957565b8115610b1c570490565b634e487b7160e01b600052601260045260246000fd5b91908201809211610ae957565b6005548015610b9b57600454610b6b610b62610b59610ba2565b60035490610adc565b60025490610aff565b670de0b6b3a764000090818102918183041490151715610ae957610b9892610b9291610b12565b90610b32565b90565b5060045490565b600154804210600014610b9857504290565b60a0810190811067ffffffffffffffff821117610bd057604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610bd057604052565b3d15610c43573d9067ffffffffffffffff8211610bd05760405191610c37601f8201601f191660200184610be6565b82523d6000602084013e565b606090565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03161480610c96575b15610c92576013193601368111610ae9573560601c90565b3390565b506014361015610c7a565b600260005414610cb2576002600055565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b610b989060018060a01b0316604060008281526006602052670de0b6b3a7640000610d4283832054610d3c610d2a610b3f565b87865260076020528686205490610adc565b90610aff565b049281526008602052205490610b32565b90816020910312610ad757518015158103610ad75790565b60408051908101916001600160a01b031667ffffffffffffffff831182841017610bd057610ddb926040526000806020958685527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656487860152868151910182855af1610dd5610c08565b91610e63565b805190828215928315610e4b575b50505015610df45750565b6084906040519062461bcd60e51b82526004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152fd5b610e5b9350820181019101610d53565b388281610de9565b91929015610ec55750815115610e77575090565b3b15610e805790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b825190915015610ed85750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b828510610f1e575050604492506000838284010152601f80199101168101030190fd5b8481018201518686016044015293810193859350610efb565b610f3f610b3f565b600455610f4a610ba2565b600355610f5681610cf7565b9060018060a01b031660005260086020526040600020556004546007602052604060002055565b60015480421015610f9657610b62610b98914290610adc565b50600090565b610fa4610b3f565b60045562093a80610fbd81420642039142908301610adc565b90600154828142101560001461107057610fd8915085610b12565b6002555b60025490600052600960205280604060002055801561105e57610fff8247610b12565b1061104c577f095667752957714306e1a6ad83495404412df6fdb932fca6dc849a7ee910d4c1916110366020924260035542610b32565b6001556040519384526001600160a01b031692a2565b604051633c6be1b360e01b8152600490fd5b6040516307ced7af60e01b8152600490fd5b61108a611084610b6261108f944290610adc565b87610b32565b610b12565b600255610fdc56fea164736f6c6343000813000a";

type GaugeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GaugeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Gauge__factory extends ContractFactory {
  constructor(...args: GaugeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _forwarder: AddressLike,
    _stakingToken: AddressLike,
    _voter: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _forwarder,
      _stakingToken,
      _voter,
      overrides || {}
    );
  }
  override deploy(
    _forwarder: AddressLike,
    _stakingToken: AddressLike,
    _voter: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _forwarder,
      _stakingToken,
      _voter,
      overrides || {}
    ) as Promise<
      Gauge & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Gauge__factory {
    return super.connect(runner) as Gauge__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GaugeInterface {
    return new Interface(_abi) as GaugeInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Gauge {
    return new Contract(address, _abi, runner) as unknown as Gauge;
  }
}
