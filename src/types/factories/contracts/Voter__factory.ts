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
import type { Voter, VoterInterface } from "../../contracts/Voter";

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
        name: "_strategyManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_factoryRegistry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyVotedOrDeposited",
    type: "error",
  },
  {
    inputs: [],
    name: "DistributeWindow",
    type: "error",
  },
  {
    inputs: [],
    name: "EpochVoteEnd",
    type: "error",
  },
  {
    inputs: [],
    name: "FactoryPathNotApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "GaugeAlreadyKilled",
    type: "error",
  },
  {
    inputs: [],
    name: "GaugeAlreadyRevived",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
    ],
    name: "GaugeDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "GaugeExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_gauge",
        type: "address",
      },
    ],
    name: "GaugeNotAlive",
    type: "error",
  },
  {
    inputs: [],
    name: "InactiveManagedNFT",
    type: "error",
  },
  {
    inputs: [],
    name: "MaximumVotingNumberTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "NonZeroVotes",
    type: "error",
  },
  {
    inputs: [],
    name: "NotApprovedOrOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEmergencyCouncil",
    type: "error",
  },
  {
    inputs: [],
    name: "NotGovernor",
    type: "error",
  },
  {
    inputs: [],
    name: "NotVault",
    type: "error",
  },
  {
    inputs: [],
    name: "NotWhitelistedToken",
    type: "error",
  },
  {
    inputs: [],
    name: "SameValue",
    type: "error",
  },
  {
    inputs: [],
    name: "SpecialVotingWindow",
    type: "error",
  },
  {
    inputs: [],
    name: "TooManyPools",
    type: "error",
  },
  {
    inputs: [],
    name: "UnequalLengths",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroBalance",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalWeight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Abstained",
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
        indexed: true,
        internalType: "address",
        name: "gauge",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DistributeReward",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "poolFactory",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "gaugeFactory",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "gauge",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "GaugeCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "gauge",
        type: "address",
      },
    ],
    name: "GaugeKilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "gauge",
        type: "address",
      },
    ],
    name: "GaugeRevived",
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
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalWeight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "whitelister",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_bool",
        type: "bool",
      },
    ],
    name: "WhitelistToken",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_gauges",
        type: "address[]",
      },
    ],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "claimable",
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
        name: "_poolFactory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
    ],
    name: "createGauge",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_gauges",
        type: "address[]",
      },
    ],
    name: "distribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_finish",
        type: "uint256",
      },
    ],
    name: "distribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyCouncil",
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
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "epochNext",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "epochStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "epochVoteEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "epochVoteStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "factoryRegistry",
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
    name: "forwarder",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "gauges",
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
    name: "governor",
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
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_vault",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "isAlive",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isGauge",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isWhitelistedToken",
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
    inputs: [
      {
        internalType: "address",
        name: "_gauge",
        type: "address",
      },
    ],
    name: "killGauge",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "lastVoted",
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
    name: "length",
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
    name: "maxVotingNum",
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
    name: "poke",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "poolForGauge",
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
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "poolVote",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "pools",
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
    name: "reset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_gauge",
        type: "address",
      },
    ],
    name: "reviveGauge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_council",
        type: "address",
      },
    ],
    name: "setEmergencyCouncil",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_governor",
        type: "address",
      },
    ],
    name: "setGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxVotingNum",
        type: "uint256",
      },
    ],
    name: "setMaxVotingNum",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strategyManager",
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
    name: "totalWeight",
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
        name: "_gauge",
        type: "address",
      },
    ],
    name: "updateFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "updateFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_gauges",
        type: "address[]",
      },
    ],
    name: "updateFor",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "usedWeights",
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
    name: "vault",
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
        internalType: "address[]",
        name: "_poolVote",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_weights",
        type: "uint256[]",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "votes",
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
    name: "weights",
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
        name: "_token",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_bool",
        type: "bool",
      },
    ],
    name: "whitelistToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60e0346200011357601f6200213738819003918201601f19168301916001600160401b03831184841017620001185780849260609460405283398101031262000113576200004d816200012e565b62000069604062000061602085016200012e565b93016200012e565b60808290526001600081905560a09290925281546001600160a01b03199081166001600160a01b039485161790925560c05290620000a662000143565b16908181600254161760025581816003541617600355818160055416176005556004541617600455601e600755604051611f9e9081620001998239608051818181610fd80152611836015260a0518181816102f70152610a75015260c051818181610a1e01526111420152f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036200011357565b6080516001600160a01b03163314806200018c575b156200018857601319360136811162000172573560601c90565b634e487b7160e01b600052601160045260246000fd5b3390565b5060143610156200015856fe608060408181526004918236101561001657600080fd5b600092833560e01c9182622f8de4146116105750816306d6a1b2146115d55781630c340a24146115ac5781630c51dde4146114da5781630e0a5968146114b55781630ffb1d8b146114125781631703e5f9146113d457816318178358146112575781631f7b6d321461123857816330331b2f146111c557816339b70e381461119c57816339e9f3b6146111715781633bf0c9fb1461112d578163402914f5146110f5578163462d0b2e14610fff578163572b6c0514610fad5781636138889b14610ef95781636f816a2014610d28578382637625391a14610c5e575081637778960e14610c36578163794cea3c146109aa57816385f2aef214610981578163880e36fc1461095757816396c82e5714610938578163992a7933146108435781639a61df891461080b5781639f06247b14610761578163a7cac84614610729578163aa79979b146106eb578163aa9354a3146106c4578163ab37f48614610686578163ac4afa3814610645578163b9a09fd51461060a578163c42cf53514610596578163c48f5af41461053d578163c9ff6f4d146104e6578163cad1b9061461049d578163d560b0d714610454578163d58b15d414610425578163d826f88f146103b8578163e586875f14610345578163e8b3fd5714610326578163f645d4f9146102e2578163f9f031df14610240575063fbfa77cf1461021557600080fd5b3461023c578160031936011261023c5760025490516001600160a01b039091168152602090f35b5080fd5b9050346102de5761025036611764565b9183835193815b858110610262578280f35b6001600160a01b03806102758385611a72565b511690610280611833565b90823b156102da57602486928389519586948593630c00007b60e41b8552168c8401525af180156102d057906102bc92916102c1575b50611801565b610257565b6102ca906116a5565b386102b6565b85513d86823e3d90fd5b8580fd5b8280fd5b50503461023c578160031936011261023c57517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50503461023c578160031936011261023c576020906007549051908152f35b919050346102de5760203660031901126102de57610361611644565b610369611833565b8354916001600160a01b0391828416908316036103a8571691821561039957506001600160a01b03191617905580f35b5163d92e233d60e01b81528390fd5b5050505163c560129360e01b8152fd5b919050346102de57826003193601126102de5762093a8042064203338452600f6020528184205481111561041757610e100142111561040a57826103fa61188c565b61040333611902565b6001815580f35b51635a780bad60e01b8152fd5b505163cade311f60e01b8152fd5b828434610451576020366003190112610451575062092c706020923591519162093a8081069003018152f35b80fd5b83346104515761046336611764565b805190825b828110610473578380f35b610498906104936001600160a01b0361048c8386611a72565b5116611d72565b611801565b610468565b50503461023c578060031936011261023c57806020926104bb611644565b6104c361165f565b6001600160a01b039182168352600c865283832091168252845220549051908152f35b50503461023c576104f6366117a2565b91905b828110610504578380f35b80610493610514610538936117b8565b90546001600160a01b0360039290921b1c8116875260096020528487205416611d72565b6104f9565b50503461023c578060031936011261023c57610557611644565b6001600160a01b039081168352600d602052818320805460243594908510156104515750602093610587916117e9565b92905490519260031b1c168152f35b9050346102de5760203660031901126102de576105b1611644565b906105ba611833565b600354926001600160a01b0391828516908316036105fa57169283156105ed5750506001600160a01b0319161760035580f35b5163d92e233d60e01b8152fd5b8451633b8d9d7560e21b81528390fd5b50503461023c57602036600319011261023c576020916001600160a01b0390829082610634611644565b168152600985522054169051908152f35b9050346102de5760203660031901126102de57359160085483101561045157506106706020926117b8565b905491519160018060a01b039160031b1c168152f35b50503461023c57602036600319011261023c5760209160ff9082906001600160a01b036106b1611644565b1681526011855220541690519015158152f35b9050346102de5760203660031901126102de57602092503590519062093a80810690038152f35b50503461023c57602036600319011261023c5760209160ff9082906001600160a01b03610716611644565b1681526010855220541690519015158152f35b50503461023c57602036600319011261023c5760209181906001600160a01b03610751611644565b168152600b845220549051908152f35b919050346102de5760203660031901126102de5761077d611644565b610785611833565b83546001600160a01b039291908316908316036107fc571691828452601260205260ff82852054166107ee575081835260126020528220805460ff191660011790557fed18e9faa3dccfd8aa45f69c4de40546b2ca9cccc4538a2323531656516db1aa8280a280f35b9051635f5a482960e11b8152fd5b50505163c560129360e01b8152fd5b50503461023c57602036600319011261023c5760209181906001600160a01b03610833611644565b168152600f845220549051908152f35b919050346102de5760203660031901126102de5761085f611644565b610867611833565b83546001600160a01b039291908316908316036107fc57811692838552601260205260ff83862054161561092a5750828452601560205281842054849181159081156108e8575b5050601260205250508220805460ff191690557f04a5d3f5d80d22d9345acc80618f4a4e7e663cf9e1aed23b57d975acec002ba78280a280f35b83928392839260025416908390610921575bf1156109165781835260156020528281812055823880806108ae565b51913d9150823e3d90fd5b506108fc6108fa565b8251633f88da5160e21b8152fd5b50503461023c578160031936011261023c576020906006549051908152f35b9050346102de5760203660031901126102de57602092503590519062093a80908181069003018152f35b50503461023c578160031936011261023c5760055490516001600160a01b039091168152602090f35b8284346104515781600319360112610451576109c4611644565b916109cd61165f565b916109d661188c565b6109de611833565b6001600160a01b039384168083526009602090815284842054909691908616610c26578451631217afdb60e01b81529186168883018190529187816024817f00000000000000000000000000000000000000000000000000000000000000008b165afa908115610c1c579087918691610bff575b508180600354169516948503610bd3575b1692855196631e533a8f60e21b8852807f0000000000000000000000000000000000000000000000000000000000000000168a890152826024890152888860448189895af1978815610bc9578698610b9a575b5082865260098952610b15878720988281169960018060a01b0319908b828254161790558a8952600a8c52858a8a209182541617905560108b5288882060ff199060018282541617905560128c5260018a8a2091825416179055611d72565b600854600160401b811015610b8757927fa4d97e9e7c65249b4cd01acb82add613adea98af32daf092366982f0a0d4e45392606092610b5e866001809b9a9998016008556117b8565b819291549060031b9185831b921b19161790558851918252898b83015288820152a35551908152f35b634e487b7160e01b875260418b52602487fd5b610bbb919850893d8b11610bc2575b610bb381836116ce565b810190611d53565b968a610ab6565b503d610ba9565b87513d88823e3d90fd5b90508185526011885260ff868620541615610bef578690610a63565b85516365a9cebb60e01b81528990fd5b610c169150893d8b11610bc257610bb381836116ce565b8a610a52565b86513d87823e3d90fd5b84516348fe415b60e11b81528890fd5b9050346102de57826003193601126102de575490516001600160a01b03909116815260209150f35b80918434610d2457610c6f366117a2565b9390610c7961188c565b600254835163541b13ef60e11b81526001600160a01b0395602094919285928492918391908a165af18015610d1a57908391610cf1575b50505b848110610cc257856001815580f35b8084610cd0610cec936117b8565b90549060031b1c16875260098352610493858589205416611e64565b610cb3565b813d8311610d13575b610d0481836116ce565b810103126102da578187610cb0565b503d610cfa565b84513d89823e3d90fd5b5050fd5b83833461023c578060031936011261023c576001600160401b038335818111610ef557610d589036908601611675565b949091602435908111610ef157610d729036908301611675565b9262093a804206420396338752602097600f895286882054811115610ee157610e108101421115610ed157610da561188c565b858203610ec1576007548211610eb15762092c70014211610ea15733808852600f8952868820429055600154875163673e156160e11b8152958601919091528890859060249082906001600160a01b03165afa938415610e97578794610e66575b5090610e13913691611706565b92610e29610e20826116ef565b955195866116ce565b8085528685019060051b820191368311610e6257905b828210610e53578661040387878733611aa6565b81358152908701908701610e3f565b8680fd5b9093508781813d8311610e90575b610e7e81836116ce565b81010312610e62575192610e13610e06565b503d610e74565b86513d89823e3d90fd5b85516370163b4560e01b81528490fd5b865163ebcfae4b60e01b81528590fd5b865163332ac86360e21b81528590fd5b8651635a780bad60e01b81528590fd5b865163cade311f60e01b81528590fd5b8480fd5b8380fd5b9050346102de5782610f0a36611764565b92610f1361188c565b600254815163541b13ef60e11b81526001600160a01b03949093602092859291839188165af1908115610fa45750610f79575b50815191835b838110610f5b57846001815580f35b8061049384610f6d610f749486611a72565b5116611e64565b610f4c565b602090813d8111610f9d575b610f8f81836116ce565b810103126102de5738610f46565b503d610f85565b513d86823e3d90fd5b50503461023c57602036600319011261023c57602090610fcb611644565b90519060018060a01b03807f0000000000000000000000000000000000000000000000000000000000000000169116148152f35b919050346102de57806003193601126102de5781356001600160401b038111610ef55761102f9036908401611675565b909161103961165f565b92611042611833565b6002546001600160a01b039691908716908716036110e75750855b83811061107c57505050501660018060a01b0319600254161760025580f35b8060051b820135908682168092036110e3578188526011602052838820805460ff191660019081179091556110de92886110b4611833565b167f44948130cf88523dbc150908a47dd6332c33a01a3869d7f2fa78e51d5a5f9c578b80a4611801565b61105d565b8780fd5b82516362df054560e01b8152fd5b50503461023c57602036600319011261023c5760209181906001600160a01b0361111d611644565b1681526015845220549051908152f35b50503461023c578160031936011261023c57517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b8284346104515760203660031901126104515750610e106020923591519162093a8081069003018152f35b50503461023c578160031936011261023c5760015490516001600160a01b039091168152602090f35b9050346102de5760203660031901126102de578035916111e3611833565b6003546001600160a01b0390811691160361122b57600a831061121e57600754831461121157505060075580f35b5163c23f6ccb60e01b8152fd5b51632db4ddc160e11b8152fd5b51633b8d9d7560e21b8152fd5b50503461023c578160031936011261023c576020906008549051908152f35b919050346102de57826003193601126102de5761127261188c565b610e1062093a80420642030142111561040a5760018054825163673e156160e11b8152339481019490945290926001600160a01b03929160209081908390602490829088165afa9182156113ca57869261139b575b50338652600d81528286209280518085848297549384815201908a52848a20928a5b8a878383106113845750505050611302925003856116ce565b83519161130e836116ef565b9561131b835197886116ce565b838752601f1961132a856116ef565b013683890137885b84811061134c5789896113478a8a8a33611aa6565b815580f35b61137f90338b52600c8452848b2083611365838b611a72565b51168c528452848b2054611379828b611a72565b52611801565b611332565b86548c168552958101958a955090930192016112e9565b9080925081813d83116113c3575b6113b381836116ce565b810103126102da575190386112c7565b503d6113a9565b83513d88823e3d90fd5b50503461023c57602036600319011261023c5760209160ff9082906001600160a01b036113ff611644565b1681526012855220541690519015158152f35b919050346102de57806003193601126102de5761142d611644565b9160243592831515809403610ef157611444611833565b6003546001600160a01b039391908416908416036114a757508116918285526011602052842060ff1981541660ff851617905561147f611833565b167f44948130cf88523dbc150908a47dd6332c33a01a3869d7f2fa78e51d5a5f9c578480a480f35b8351633b8d9d7560e21b8152fd5b8334610451576020366003190112610451576114d76114d2611644565b611d72565b80f35b919050826003193601126102de576114f0611833565b6002546001600160a01b03918216939116830361159e57670de0b6b3a76400009081340291348304143415171561158b57507f095667752957714306e1a6ad83495404412df6fdb932fca6dc849a7ee910d4c19161155e602092600654600181116000146115825790611a86565b8061156d575b5051348152a280f35b611579906013546118e2565b60135538611564565b50600190611a86565b634e487b7160e01b855260119052602484fd5b90516362df054560e01b8152fd5b50503461023c578160031936011261023c5760035490516001600160a01b039091168152602090f35b50503461023c57602036600319011261023c576020916001600160a01b03908290826115ff611644565b168152600a85522054169051908152f35b849084346102de5760203660031901126102de576020926001600160a01b03611637611644565b168152600e845220548152f35b600435906001600160a01b038216820361165a57565b600080fd5b602435906001600160a01b038216820361165a57565b9181601f8401121561165a578235916001600160401b03831161165a576020808501948460051b01011161165a57565b6001600160401b0381116116b857604052565b634e487b7160e01b600052604160045260246000fd5b90601f801991011681019081106001600160401b038211176116b857604052565b6001600160401b0381116116b85760051b60200190565b9291611711826116ef565b9161171f60405193846116ce565b829481845260208094019160051b810192831161165a57905b8282106117455750505050565b81356001600160a01b038116810361165a578152908301908301611738565b602060031982011261165a57600435906001600160401b03821161165a578060238301121561165a5781602461179f93600401359101611706565b90565b604090600319011261165a576004359060243590565b6008548110156117d357600860005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b80548210156117d35760005260206000200190600090565b60001981146118105760010190565b634e487b7160e01b600052601160045260246000fd5b9190820391821161181057565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03161480611881575b1561187d576013193601368111611810573560601c90565b3390565b506014361015611865565b60026000541461189d576002600055565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b9190820180921161181057565b8181029291811591840414171561181057565b60018060a01b0380911690600090828252602092600d8452604091828420908154908592865b838110611987575050505061193f90600654611826565b6006558252600e83528181812055600d835281209182549282815583611966575b50505050565b82528120918201915b82811061197c5780611960565b81815560010161196f565b888361199383856117e9565b90549060031b1c16878a52600c808352898b20828c528352898b2054908a8c836119cc575b5050505050506119c790611801565b611928565b859a9291899495969160098693522054166119e690611d72565b848d52600b809a528b8d20848154906119fe91611826565b90558a8d528d528a8c20848d528d52828c8c812055611a1c916118e2565b97611a25611833565b848d52908d528a8c20548b51938452602084015242604084015216907f3e8b1c6af149581ed7abb63a47f214448cce9d760a210d4d7cfe12399fc5b69790606090a3883880808a8c6119b8565b80518210156117d35760209160051b010190565b8115611a90570490565b634e487b7160e01b600052601260045260246000fd5b919290611ab283611902565b835190600092838096815b858110611d2f575060005b858110611afe57505050505050611ae1906006546118e2565b6006556001600160a01b03166000908152600e6020526040902055565b6001600160a01b03611b108284611a72565b51166000818152600960205260409020546001600160a01b0316908115611d175781600052601260205260ff806040600020541615611cfe5782600052601060205260406000205416611b6e575b5050611b6990611801565b611ac8565b611b9185611b8c89611b869c9e9c878b989798611a72565b516118ef565b611a86565b9260018060a01b038b16600052600c602052604060002082600052602052604060002054611cec578315611cda57611bc890611d72565b6001600160a01b038a166000908152600d602052604090208054909390600160401b8110156116b85781611c77818e9d611c0e85611b699a6001611c7d980181556117e9565b81549060031b9089821b9160018060a01b03901b191617905586600052600b9e8f6020526040600020611c428482546118e2565b905560018060a01b0316600052600c6020526040600020876000526020526040600020611c708382546118e2565b90556118e2565b9d6118e2565b600083815260209b8c526040908190205481519384529b83019b909b52429a82019a909a526001600160a01b038b16907fa1bc625e9c44bf21dd212ffbb0d5fb1d28c54b91ebce688958ccbfc721984b4b90606090a39038611b5e565b60405163334ab3f560e11b8152600490fd5b60405163315f6a3d60e01b8152600490fd5b6040516302b0b9ed60e61b815260048101849052602490fd5b60249060405190634c89018560e01b82526004820152fd5b91611d48611d4e91611d418587611a72565b51906118e2565b92611801565b611abd565b9081602091031261165a57516001600160a01b038116810361165a5790565b6001600160a01b039081166000818152600a602090815260408083205485168352600b8252808320549093908015611e535781845260148352611dbf858520805490601354809155611826565b9081611dcf575b50505050505050565b670de0b6b3a764000091611de2916118ef565b04948184526012835260ff8585205416600014611e1d57508252601590522080549091611e0e916118e2565b90555b38808080808080611dc6565b8395849350839250829160025416828215611e4a575bf115611e40575050611e11565b51903d90823e3d90fd5b506108fc611e33565b509350601490601354948352522055565b90611e6e82611d72565b6001600160a01b0391821660008181526015602090815260408083205481516302dcc80960e31b8152939691939091908381600481895afa908115611f4e578891611f64575b50821180611f58575b611ecb575b50505050509050565b848752601583528684812055843b15610e62578351630314777960e21b81528781600481868a5af18015611f4e577f4fa9693cae526341d334e2862ca2413b2e503f1266255f9e0869fb36e6d89b179596979850611f3f575b50611f2d611833565b169351908152a3803880808080611ec2565b611f48906116a5565b38611f24565b85513d8a823e3d90fd5b5062093a808211611ebd565b90508381813d8311611f8a575b611f7b81836116ce565b810103126110e3575138611eb4565b503d611f7156fea164736f6c6343000813000a";

type VoterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VoterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Voter__factory extends ContractFactory {
  constructor(...args: VoterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _forwarder: AddressLike,
    _strategyManager: AddressLike,
    _factoryRegistry: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _forwarder,
      _strategyManager,
      _factoryRegistry,
      overrides || {}
    );
  }
  override deploy(
    _forwarder: AddressLike,
    _strategyManager: AddressLike,
    _factoryRegistry: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _forwarder,
      _strategyManager,
      _factoryRegistry,
      overrides || {}
    ) as Promise<
      Voter & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Voter__factory {
    return super.connect(runner) as Voter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VoterInterface {
    return new Interface(_abi) as VoterInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Voter {
    return new Contract(address, _abi, runner) as unknown as Voter;
  }
}
