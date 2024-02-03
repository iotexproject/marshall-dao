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
  VotingRewardsFactory,
  VotingRewardsFactoryInterface,
} from "../../../contracts/factories/VotingRewardsFactory";

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
    name: "createRewards",
    outputs: [
      {
        internalType: "address",
        name: "bribeVotingReward",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657611948908161001c8239f35b600080fdfe6080600436101561000f57600080fd5b6000803560e01c63dabc8e831461002557600080fd5b346101595760409182600319360112610155576001600160a01b03600435818116949192908590036101515760243583811680910361014d5767ffffffffffffffff958284018781118482101761013957845260019081845260209788850193893686378551156101255784528551946117df8087019283118784101761011157916080918796959361015d883960608201948252338c83015260608983015251809452019291885b8a8282106100f9575050505050039084f09283156100ee57505191168152f35b9051903d90823e3d90fd5b84518a168652879650948501949093019282016100ce565b634e487b7160e01b8a52604160045260248afd5b634e487b7160e01b89526032600452602489fd5b634e487b7160e01b87526041600452602487fd5b8480fd5b8380fd5b5080fd5b80fdfe60e0604090808252346200029657620017df8038038091620000228285620002b1565b833981019060608183031262000296576200003d81620002d5565b906020916200004e838301620002d5565b938583015160018060401b039384821162000296570181601f82011215620002965780519384116200029b578360051b908751946200009087840187620002b1565b85528580860192820101928311620002965785809101915b8383106200027b57505050506080526001926000908482558060a05260018060a01b0380911693865191630fc2838b60e11b8352600492828185818a5afa9081156200027157859162000230575b5060c052845194845b8681106200015d5788546001600160a01b0319168817895589516114c990816200031682396080518181816109150152610be0015260a0518181816103cb0152818161071001526109ed015260c0518181816102050152610a830152f35b826200016a8284620002ea565b511662000197575b600019811462000184578801620000ff565b634e487b7160e01b865260118552602486fd5b82620001a48284620002ea565b5116865260078452898620805460ff19168a17905582620001c68284620002ea565b51166006805490680100000000000000008210156200021d578b82018082558210156200020a5788528588200180546001600160a01b031916909117905562000172565b634e487b7160e01b895260328852602489fd5b634e487b7160e01b895260418852602489fd5b90508281813d831162000269575b6200024a8183620002b1565b8101031262000265576200025e90620002d5565b38620000f6565b8480fd5b503d6200023e565b89513d87823e3d90fd5b81906200028884620002d5565b8152019101908590620000a8565b600080fd5b634e487b7160e01b600052604160045260246000fd5b601f909101601f19168101906001600160401b038211908210176200029b57604052565b51906001600160a01b03821682036200029657565b8051821015620002ff5760209160051b010190565b634e487b7160e01b600052603260045260246000fdfe6080604081815260048036101561001557600080fd5b600092833560e01c90816318160ddd14610ad0575080631be0528914610ab25780631f85071614610a6e5780633e491d4714610a45578063456cb7c614610a1c57806346c96aac146109d857806349dcc204146109a15780634d5ce03814610963578063505897931461093c578063572b6c05146108ea57806376f4be36146108ca57806392777b291461088c5780639cc7f708146108655780639e2bf22c146107ec578063a28d4c9c146107c9578063b66503cf146105dc578063e6886396146105bd578063e8111a121461059e578063f25e55a514610559578063f301af4214610516578063f320772314610469578063f5f8d365146101545763f7412baf1461012057600080fd5b3461015057602036600319011261015057918192358152600a602052206001815491015482519182526020820152f35b8280fd5b509034610150578060031936011261015057813591602480359167ffffffffffffffff918284116104655736602385011215610465578382013592831161045457845160059460209480871b906101ad87830185610b80565b8352838684019183010191368311610450578401905b82821061042d575050506101d5610c36565b6101dd610bdd565b865163430c208160e01b81526001600160a01b03828116868301908152602081018b905290957f0000000000000000000000000000000000000000000000000000000000000000871695939092909188908290819003604001818f8a5af1908115610423578c916103f6575b501590816103c7575b506103b957888287928a5196879384926331a9108f60e11b84528301525afa9283156103af578993610373575b50815197895b898110610294578a6001815580f35b806102ae83886102a761031395896114a8565b5116610efc565b876102b983886114a8565b51168d528989528a8d20848e5289528a8d2042905580610318575b876102df83886114a8565b5116908b519081527f9aa05b3d70a9e3e2f004f039648839560576334fb45c81f91b6db03ad9e2efc98a8a8a1692a3610ee0565b610285565b61036e8861032684896114a8565b518d5163a9059cbb60e01b8d8201526001600160a01b038b168982019081526020810186905290929091169061036990839060400103601f198101845283610b80565b611297565b6102d4565b9092508481813d83116103a8575b61038b8183610b80565b810103126103a4575183811681036103a457913861027f565b8880fd5b503d610381565b87513d8b823e3d90fd5b875163ea8e4eb560e01b8152fd5b86167f000000000000000000000000000000000000000000000000000000000000000087161415905038610252565b6104169150883d8a1161041c575b61040e8183610b80565b810190610ba2565b38610249565b503d610404565b8a513d8e823e3d90fd5b81356001600160a01b038116810361044c5781529086019086016101c3565b8b80fd5b8a80fd5b634e487b7160e01b87526041825286fd5b8680fd5b50346101505761047836610b07565b92610481610bdd565b6001546001600160a01b0391821694911684036105085750816020916104ca7f90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a1594600254610eef565b600255858752600383528087206104e2838254610eef565b9055858752600383526104f881882054876110ae565b6105006111c6565b51908152a380f35b905163ea8e4eb560e01b8152fd5b50346101505760203660031901126101505735916006548310156105565750610540602092610b1d565b905491519160018060a01b039160031b1c168152f35b80fd5b50503461059a578060031936011261059a5760209181906001600160a01b03610580610aec565b168152600584528181206024358252845220549051908152f35b5080fd5b50503461059a578160031936011261059a57602090600b549051908152f35b50503461059a578160031936011261059a576020906006549051908152f35b5090346101505780600319360112610150576105f6610aec565b60243590610602610c36565b61060a610bdd565b9160018060a01b03809216938487526020926007845260ff8289205416156106f7575b82156106e7578151946323b872dd60e01b8587015216938460248201523060448201528260648201526064815260a0810181811067ffffffffffffffff8211176106d45782916106a2917f52977ea98a2220a03ee9ba5cb003ada08d394ea10155483c95dc2dc77a7eb24b9695945287611297565b62093a804206420396868952835280882087895283528088206106c6838254610eef565b905551908152a46001815580f35b634e487b7160e01b895260418852602489fd5b8151631f2a200560e01b81528790fd5b815163559bfa4360e11b815287810187905284816024817f000000000000000000000000000000000000000000000000000000000000000086165afa9081156107bf5789916107a2575b50156107925785885260078452818820805460ff19166001179055600654600160401b8110156106d45780600161077b9201600655610b1d565b81549060031b908389831b921b191617905561062d565b8151630b094f2760e31b81528790fd5b6107b99150853d871161041c5761040e8183610b80565b38610741565b83513d8b823e3d90fd5b50503461059a576020906107e56107df36610b07565b90610caa565b9051908152f35b5034610150576107fb36610b07565b92610804610bdd565b6001546001600160a01b03918216949116840361050857508160209161084d7ff279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b56894600254610bba565b600255858752600383528087206104e2838254610bba565b50346101505760203660031901126101505760209282913581526003845220549051908152f35b503461015057816003193601126101505760209282916001600160a01b036108b2610aec565b16825284528181206024358252845220549051908152f35b50913461055657602036600319011261055657506107e560209235610de4565b50503461059a57602036600319011261059a57602090610908610aec565b90519060018060a01b03807f0000000000000000000000000000000000000000000000000000000000000000169116148152f35b50346101505760203660031901126101505760209282913581526009845220549051908152f35b50503461059a57602036600319011261059a5760209160ff9082906001600160a01b0361098e610aec565b1681526007855220541690519015158152f35b50503461059a5780916109b336610b07565b9082526008602052828220908252602052206001815491015482519182526020820152f35b50503461059a578160031936011261059a57517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50503461059a578160031936011261059a5760015490516001600160a01b039091168152602090f35b50503461059a578060031936011261059a576020906107e5610a65610aec565b60243590610efc565b50503461059a578160031936011261059a57517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50503461059a578160031936011261059a576020905162093a808152f35b84903461059a578160031936011261059a576020906002548152f35b600435906001600160a01b0382168203610b0257565b600080fd5b6040906003190112610b02576004359060243590565b600654811015610b3857600660005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b6040810190811067ffffffffffffffff821117610b6a57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610b6a57604052565b90816020910312610b0257518015158103610b025790565b91908203918211610bc757565b634e487b7160e01b600052601160045260246000fd5b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03161480610c2b575b15610c27576013193601368111610bc7573560601c90565b3390565b506014361015610c0f565b600260005414610c47576002600055565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b90604051610c9981610b4e565b602060018294805484520154910152565b60008181526020926009845260409081832054918215610ddb5760089586815281852096600019948581019081119889610dc757818852835284848820541115610dbb578787528183528387208780528352848488205411610daf578698610d9b57969594939291905b888811610d2657505050505050505090565b610d3c610d338a8a610bba565b60011c89610bba565b988787528183528387208a88528352610d56848820610c8c565b51858103610d6b575050505050505050505090565b9480969798999a9293949510600014610d8d5750975b96959493929190610d14565b985085810190811115610d81575b634e487b7160e01b87526011600452602487fd5b50505050505091505090565b98975050505050505050565b634e487b7160e01b88526011600452602488fd5b50505091505090565b600b548015610ed957600019818101918211929083610bc757600091838352600a9360209480865260409183838720541115610ece57858052838387205411610ec3578597610eaf579594939291905b878711610e45575050505050505090565b610e5b610e528989610bba565b60011c88610bba565b97888652818752610e6d838720610c8c565b51848103610e815750505050505050505090565b9380959697989992939410600014610ea15750965b959493929190610e34565b975084810190811115610e96575b634e487b7160e01b86526011600452602486fd5b505050505091505090565b979650505050505050565b5050600090565b6000198114610bc75760010190565b91908201809211610bc757565b90600081815260209160098352604080832054156110a657829460018060a01b0316808452600585528184208385528552818420549362093a8094858106900392610f478486610caa565b938583526008948589528284209084528852610f64828420610c8c565b5187810690038082111561109f57505b86610f83828242064203610bba565b049687610f97575b50505050505050505090565b839291989796959493905b878210610faf5750610f8b565b90919293949596979899818b019a8b8111610eaf5762093a7f8101908c8211610d9b57610fdc828b610caa565b8a8852898d528688209088528c52610ffe610ff8878920610c8c565b92610de4565b8752600a8c528b80600180898b200154908082116000146110975750935b01519189895260048092528789209089528d52868820549182810292818404149015171561108457821561107157509161105b91611062930490610eef565b9a92610ee0565b90989796959493929198610fa2565b634e487b7160e01b885260129052602487fd5b634e487b7160e01b885260119052602487fd5b90509361101c565b9050610f74565b505091505090565b9190600083815260209060098252604091828220549586151580611181575b1561112b578351946110de86610b4e565b4286528286015282526008815282822090600019870196871161111757611115959683525220906020600191805184550151910155565b565b634e487b7160e01b83526011600452602483fd5b9091929361116c9085979697519061114282610b4e565b42825284820152828552600884528585208786528452858520906020600191805184550151910155565b60018501809511611117578252600990522055565b506008825283832060001988018881116111b257845282528383205462093a809081420642039181069003146110cd565b634e487b7160e01b85526011600452602485fd5b600b5480151580611267575b1561121d57600254604051906111e782610b4e565b42825260208201526000198201918211610bc75761111591600052600a6020526040600020906020600191805184550151910155565b6112576002546040519061123082610b4e565b428252602082015282600052600a6020526040600020906020600191805184550151910155565b60018101809111610bc757600b55565b506000198101818111610bc757600052600a60205260406000205462093a809081420642039181069003146111d2565b6040516001600160a01b039091169291906112b181610b4e565b6020918282527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564838301526000808285829451910182895af13d156113c8573d9567ffffffffffffffff87116113b45761132c9495966040519061131e88601f19601f8401160183610b80565b81528093873d92013e6113d4565b80519082821592831561139c575b505050156113455750565b6084906040519062461bcd60e51b82526004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152fd5b6113ac9350820181019101610ba2565b38828161133a565b634e487b7160e01b83526041600452602483fd5b61132c93949591506060915b9192901561143657508151156113e8575090565b3b156113f15790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b8251909150156114495750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b82851061148f575050604492506000838284010152601f80199101168101030190fd5b848101820151868601604401529381019385935061146c565b8051821015610b385760209160051b01019056fea164736f6c6343000813000aa164736f6c6343000813000a";

type VotingRewardsFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VotingRewardsFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VotingRewardsFactory__factory extends ContractFactory {
  constructor(...args: VotingRewardsFactoryConstructorParams) {
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
      VotingRewardsFactory & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): VotingRewardsFactory__factory {
    return super.connect(runner) as VotingRewardsFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VotingRewardsFactoryInterface {
    return new Interface(_abi) as VotingRewardsFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): VotingRewardsFactory {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as VotingRewardsFactory;
  }
}
