/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  TestToken,
  TestTokenInterface,
} from "../../../contracts/test/TestToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
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
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60406080815234620003ce5762000d76803803806200001e81620003d3565b92833981018282820312620003ce5781516001600160401b0390818111620003ce57826200004e918501620003f9565b9260209283820151838111620003ce576200006a9201620003f9565b92805191808311620002ce5760038054936001938486811c96168015620003c3575b87871014620003ad578190601f9687811162000357575b508790878311600114620002f057600092620002e4575b505060001982841b1c191690841b1781555b8551918211620002ce5760049586548481811c91168015620002c3575b87821014620002ae5785811162000263575b508590858411600114620001f857938394918492600095620001ec575b50501b92600019911b1c19161783555b3315620001ad575060025469021e19e0c9bab2400000928382018092116200019857506000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9160025533835282815284832084815401905584519384523393a35161090a90816200046c8239f35b601190634e487b7160e01b6000525260246000fd5b90606493519262461bcd60e51b845283015260248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b01519350388062000118565b9190601f198416928860005284886000209460005b8a898383106200024b575050501062000230575b50505050811b01835562000128565b01519060f884600019921b161c191690553880808062000221565b8686015189559097019694850194889350016200020d565b87600052866000208680860160051c820192898710620002a4575b0160051c019085905b82811062000297575050620000fb565b6000815501859062000287565b925081926200027e565b602288634e487b7160e01b6000525260246000fd5b90607f1690620000e9565b634e487b7160e01b600052604160045260246000fd5b015190503880620000ba565b90869350601f1983169185600052896000209260005b8b82821062000340575050841162000327575b505050811b018155620000cc565b015160001983861b60f8161c1916905538808062000319565b8385015186558a9790950194938401930162000306565b90915083600052876000208780850160051c8201928a8610620003a3575b918891869594930160051c01915b82811062000393575050620000a3565b6000815585945088910162000383565b9250819262000375565b634e487b7160e01b600052602260045260246000fd5b95607f16956200008c565b600080fd5b6040519190601f01601f191682016001600160401b03811183821017620002ce57604052565b919080601f84011215620003ce5782516001600160401b038111620002ce576020906200042f601f8201601f19168301620003d3565b92818452828287010111620003ce5760005b8181106200045757508260009394955001015290565b85810183015184820184015282016200044156fe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde031461053557508163095ea7b31461050b57816318160ddd146104ec57816323b872dd14610422578163313ce5671461040657816339509351146103b657816370a082311461037f57816395d89b411461027d578163a0712d68146101cc578163a457c2d71461012457508063a9059cbb146100f45763dd62ed3e146100a957600080fd5b346100f057806003193601126100f057806020926100c5610639565b6100cd610654565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b50346100f057806003193601126100f05760209061011d610113610639565b602435903361068d565b5160018152f35b905082346101c957826003193601126101c95761013f610639565b918360243592338152600160205281812060018060a01b03861682526020522054908282106101785760208561011d85850387336107fb565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b9190503461027957602036600319011261027957813591331561023757506101f68260025461066a565b6002553383528260205280832082815401905551908152817fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60203393a380f35b6020606492519162461bcd60e51b8352820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b8280fd5b8383346100f057816003193601126100f057805190828454600181811c90808316928315610375575b602093848410811461036257838852908115610346575060011461030e575b505050829003601f01601f191682019267ffffffffffffffff8411838510176102fb57508291826102f79252826105f0565b0390f35b634e487b7160e01b815260418552602490fd5b919250868652828620918387935b83851061033257505050508301018580806102c5565b80548886018301529301928490820161031c565b60ff1916878501525050151560051b84010190508580806102c5565b634e487b7160e01b895260228a52602489fd5b91607f16916102a6565b5050346100f05760203660031901126100f05760209181906001600160a01b036103a7610639565b16815280845220549051908152f35b5050346100f057806003193601126100f05761011d6020926103ff6103d9610639565b338352600186528483206001600160a01b0382168452865291849020546024359061066a565b90336107fb565b5050346100f057816003193601126100f0576020905160128152f35b839150346100f05760603660031901126100f05761043e610639565b610446610654565b91846044359460018060a01b038416815260016020528181203382526020522054906000198203610480575b60208661011d87878761068d565b8482106104a9575091839161049e6020969561011d950333836107fb565b919394819350610472565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346100f057816003193601126100f0576020906002549051908152f35b5050346100f057806003193601126100f05760209061011d61052b610639565b60243590336107fb565b8490843461027957826003193601126102795782600354600181811c908083169283156105e6575b60209384841081146103625783885290811561034657506001146105ad57505050829003601f01601f191682019267ffffffffffffffff8411838510176102fb57508291826102f79252826105f0565b91925060038652828620918387935b8385106105d257505050508301018580806102c5565b8054888601830152930192849082016105bc565b91607f169161055d565b6020808252825181830181905290939260005b82811061062557505060409293506000838284010152601f8019910116010190565b818101860151848201604001528501610603565b600435906001600160a01b038216820361064f57565b600080fd5b602435906001600160a01b038216820361064f57565b9190820180921161067757565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b039081169182156107a857169182156107575760008281528060205260408120549180831061070357604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b039081169182156108ac571691821561085c5760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260018252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fdfea164736f6c6343000813000a";

type TestTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestToken__factory extends ContractFactory {
  constructor(...args: TestTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _name: string,
    _symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_name, _symbol, overrides || {});
  }
  override deploy(
    _name: string,
    _symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_name, _symbol, overrides || {}) as Promise<
      TestToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TestToken__factory {
    return super.connect(runner) as TestToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestTokenInterface {
    return new Interface(_abi) as TestTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): TestToken {
    return new Contract(address, _abi, runner) as unknown as TestToken;
  }
}
