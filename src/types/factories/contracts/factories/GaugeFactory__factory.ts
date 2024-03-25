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
  GaugeFactory,
  GaugeFactoryInterface,
} from "../../../contracts/factories/GaugeFactory";

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
        name: "_pool",
        type: "address",
      },
    ],
    name: "createGauge",
    outputs: [
      {
        internalType: "address",
        name: "gauge",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608080604052346100165761138f908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c63794cea3c1461002a57600080fd5b346100d35760403660031901126100d3576001600160a01b0390600435828116908190036100cf576024358381168091036100cb576112ab918284019284841067ffffffffffffffff8511176100b757916060939185936100d885398252602082015233604082015203019083f09081156100ac576020925060405191168152f35b6040513d84823e3d90fd5b634e487b7160e01b87526041600452602487fd5b8480fd5b8380fd5b5080fdfe61010080604052346200016357606081620012ab803803809162000024828562000168565b83398101031262000163576020816200003f600493620001a2565b906200005b604062000053858401620001a2565b9201620001a2565b608092909252600160005560a05260c0819052604051630fc2838b60e11b815292839182906001600160a01b03165afa908115620001575760009162000113575b5060e0526040516110f39081620001b882396080518181816107520152610c9a015260a0518181816103d10152818161053201528181610695015261097f015260c0518181816102b20152818161032c015281816105f10152818161078e0152610a6b015260e0518181816107f901526109d80152f35b6020813d82116200014e575b816200012e6020938362000168565b810103126200014a57620001439150620001a2565b386200009c565b5080fd5b3d91506200011f565b6040513d6000823e3d90fd5b600080fd5b601f909101601f19168101906001600160401b038211908210176200018c57604052565b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b0382168203620001635756fe6040608081526004908136101561001557600080fd5b600091823560e01c9081628cc26214610aea5781630700037d14610ab25781630c51dde414610a4357816316e6404814610a2657816318160ddd14610a075781631f850716146109c35781632e1a7d4d146108b45781633506c729146107bd57816346c96aac14610779578163572b6c05146107275781636e553f651461059957816370a082311461056157816372f702f31461051d5781637b0a47ee146104fe57816380faa57d146104e15781638b876347146104a957816394af5b6314610481578163b6b55f25146102dd578163c00007b0146101a5578163c8f33c9114610186578163cd3daf9d14610162578163df136d6514610140575063ebe2b12b1461011f57600080fd5b3461013c578160031936011261013c576020906001549051908152f35b5080fd5b90503461015e578260031936011261015e5760209250549051908152f35b8280fd5b50503461013c578160031936011261013c5760209061017f610b8e565b9051908152f35b50503461013c578160031936011261013c576020906003549051908152f35b90503461015e57602036600319011261015e576101c0610b10565b916101c9610cf0565b6101d1610c97565b6001600160a01b03808516949181168086141591826102b0575b50506102a2576101fa90610f86565b8284526008602052808420918483549384610218575b506001815580f35b558480808086885af1610229610c57565b501561026557507f1f89f96333d3133000ee447473151fa9606543368f02271c9d95ae14f13bcc679160209151908152a2388080808481610210565b6020606492519162461bcd60e51b835282015260186024820152773a3930b739b332b9103932bbb0b93239903330b4b632b21760411b6044820152fd5b505163ea8e4eb560e01b8152fd5b7f0000000000000000000000000000000000000000000000000000000000000000161415905038806101eb565b90503461015e5760208060031936011261047d5781356102fb610c97565b92610304610cf0565b811561046f578451631703e5f960e01b815230828201526001600160a01b03919084816024817f000000000000000000000000000000000000000000000000000000000000000087165afa908115610465578891610438575b501561042a5750907f5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f629291610390610c97565b9461039a81610f86565b6103f6828851976323b872dd60e01b878a01521696876024820152306044820152846064820152606481526103ce81610c03565b837f000000000000000000000000000000000000000000000000000000000000000016610dba565b61040283600554610b81565b60055516948587526006835280872061041c838254610b81565b905551908152a36001815580f35b85516310f3d9c960e01b8152fd5b6104589150853d871161045e575b6104508183610c35565b810190610da2565b3861035d565b503d610446565b87513d8a823e3d90fd5b8451631f2a200560e01b8152fd5b8380fd5b90503461015e57602036600319011261015e5760209282913581526009845220549051908152f35b50503461013c57602036600319011261013c5760209181906001600160a01b036104d1610b10565b1681526007845220549051908152f35b50503461013c578160031936011261013c5760209061017f610bf1565b50503461013c578160031936011261013c576020906002549051908152f35b50503461013c578160031936011261013c57517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50503461013c57602036600319011261013c5760209181906001600160a01b03610589610b10565b1681526006845220549051908152f35b9190503461015e578060031936011261015e576001600160a01b03602435818116939192823591858103610723576105cf610cf0565b8215610713578151631703e5f960e01b815230858201526020949085816024817f00000000000000000000000000000000000000000000000000000000000000008b165afa9081156107095789916106ec575b50156106de5750906106ba7f5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f6294939261066261065c610c97565b91610f86565b868351916323b872dd60e01b8784015216968760248301523060448301528460648301526064825261069382610c03565b7f000000000000000000000000000000000000000000000000000000000000000016610dba565b6106c682600554610b81565b6005558587526006835280872061041c838254610b81565b82516310f3d9c960e01b8152fd5b6107039150863d881161045e576104508183610c35565b38610622565b84513d8b823e3d90fd5b8151631f2a200560e01b81528490fd5b8680fd5b50503461013c57602036600319011261013c57602090610745610b10565b90519060018060a01b03807f0000000000000000000000000000000000000000000000000000000000000000169116148152f35b50503461013c578160031936011261013c57517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b90508260031936011261015e576107d2610cf0565b6107da610c97565b82516342f9577960e11b81529092906001600160a01b039060208185817f000000000000000000000000000000000000000000000000000000000000000086165afa9081156108aa579082918791610869575b50169084160361085c57341561084f57836108483485610feb565b6001815580f35b51631f2a200560e01b8152fd5b51633a7cfa5d60e21b8152fd5b9150506020813d82116108a2575b8161088460209383610c35565b8101031261089e5751818116810361089e5781903861082d565b8580fd5b3d9150610877565b83513d88823e3d90fd5b9190503461015e57602036600319011261015e578135906108d3610cf0565b6108db610c97565b926108e584610f86565b6108f183600554610b2b565b60055560018060a01b03809416938486526006602052828620610915858254610b2b565b905582519163a9059cbb60e01b602084015285602484015284604484015260448352608083019083821067ffffffffffffffff8311176109b057507f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364949284926109a492602096527f000000000000000000000000000000000000000000000000000000000000000016610dba565b51908152a26001815580f35b634e487b7160e01b885260419052602487fd5b50503461013c578160031936011261013c57517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50503461013c578160031936011261013c576020906005549051908152f35b50503461013c578160031936011261013c5760209061017f610fcc565b90508260031936011261015e57610a58610cf0565b610a60610c97565b916001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811690841603610aa557341561084f57836108483485610feb565b5163c18384c160e01b8152fd5b50503461013c57602036600319011261013c5760209181906001600160a01b03610ada610b10565b1681526008845220549051908152f35b50503461013c57602036600319011261013c5760209061017f610b0b610b10565b610d46565b600435906001600160a01b0382168203610b2657565b600080fd5b91908203918211610b3857565b634e487b7160e01b600052601160045260246000fd5b81810292918115918404141715610b3857565b8115610b6b570490565b634e487b7160e01b600052601260045260246000fd5b91908201809211610b3857565b6005548015610bea57600454610bba610bb1610ba8610bf1565b60035490610b2b565b60025490610b4e565b670de0b6b3a764000090818102918183041490151715610b3857610be792610be191610b61565b90610b81565b90565b5060045490565b600154804210600014610be757504290565b60a0810190811067ffffffffffffffff821117610c1f57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610c1f57604052565b3d15610c92573d9067ffffffffffffffff8211610c1f5760405191610c86601f8201601f191660200184610c35565b82523d6000602084013e565b606090565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03161480610ce5575b15610ce1576013193601368111610b38573560601c90565b3390565b506014361015610cc9565b600260005414610d01576002600055565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b610be79060018060a01b0316604060008281526006602052670de0b6b3a7640000610d9183832054610d8b610d79610b8e565b87865260076020528686205490610b2b565b90610b4e565b049281526008602052205490610b81565b90816020910312610b2657518015158103610b265790565b60408051908101916001600160a01b031667ffffffffffffffff831182841017610c1f57610e2a926040526000806020958685527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656487860152868151910182855af1610e24610c57565b91610eb2565b805190828215928315610e9a575b50505015610e435750565b6084906040519062461bcd60e51b82526004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152fd5b610eaa9350820181019101610da2565b388281610e38565b91929015610f145750815115610ec6575090565b3b15610ecf5790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b825190915015610f275750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b828510610f6d575050604492506000838284010152601f80199101168101030190fd5b8481018201518686016044015293810193859350610f4a565b610f8e610b8e565b600455610f99610bf1565b600355610fa581610d46565b9060018060a01b031660005260086020526040600020556004546007602052604060002055565b60015480421015610fe557610bb1610be7914290610b2b565b50600090565b610ff3610b8e565b60045562093a8061100c81420642039142908301610b2b565b9060015482814210156000146110bf57611027915085610b61565b6002555b6002549060005260096020528060406000205580156110ad5761104e8247610b61565b1061109b577f095667752957714306e1a6ad83495404412df6fdb932fca6dc849a7ee910d4c1916110856020924260035542610b81565b6001556040519384526001600160a01b031692a2565b604051633c6be1b360e01b8152600490fd5b6040516307ced7af60e01b8152600490fd5b6110d96110d3610bb16110de944290610b2b565b87610b81565b610b61565b60025561102b56fea164736f6c6343000813000aa164736f6c6343000813000a";

type GaugeFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GaugeFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GaugeFactory__factory extends ContractFactory {
  constructor(...args: GaugeFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      GaugeFactory & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): GaugeFactory__factory {
    return super.connect(runner) as GaugeFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GaugeFactoryInterface {
    return new Interface(_abi) as GaugeFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): GaugeFactory {
    return new Contract(address, _abi, runner) as unknown as GaugeFactory;
  }
}
