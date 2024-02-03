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
  DelegationLogicLibrary,
  DelegationLogicLibraryInterface,
} from "../../../contracts/libraries/DelegationLogicLibrary";

const _abi = [
  {
    inputs: [],
    name: "SafeCastUnderflow",
    type: "error",
  },
] as const;

const _bytecode =
  "0x6080806040523461001c576108e090816100228239308160080152f35b600080fdfe604060808152307f000000000000000000000000000000000000000000000000000000000000000014600436101561003657600080fd5b600091823560e01c908163656a7ea61461027a578163690f66bf146100a0575063ebe333721461006557600080fd5b61009d5760a036600319011261009d57608435801515810361009957610096906064356044356024356004356104da565b80f35b5080fd5b80fd5b9190506100995760e03660031901126100995760a435906044356084356001600160a01b0360243560c4358281169081900361027657838852602094600435865286892054600f0b89811261026657858a52838752878a205465ffffffffffff9590861693841561024f57878c52838952898c208761011e876102bd565b168d5289526101378a8d20935b60038501548689610327565b878c52838952898c20858d52895260028a8d20934285550154600284019081558c60038501928d84558a600187019260018060a01b03199283855416178455610181828a8d6105e3565b156101c15797509750505050505050528352838620908154906101a5818316610303565b169065ffffffffffff19161790555b8452606435905282205580f35b9091939597995099919395979952878b528d8c8120916101e08b6102bd565b1690528a528a8d20958603610226575b5050505050508287528352838620908652825261022183862060036000918281558260018201558260028201550155565b6101b4565b6003944287556001870192541690825416179055546002840155549101553880808080806101f0565b838952898c208c805289526101378a8d209361012b565b875162406f5d60e21b8152600490fd5b8780fd5b839060a036600319011261009957604435916001600160a01b038316830361009d57506102b6602092608435906064359060243560043561063f565b9051908152f35b65ffffffffffff90811660001901919082116102d557565b634e487b7160e01b600052601160045260246000fd5b65ffffffffffff91821690821603919082116102d557565b65ffffffffffff8091169081146102d55760010190565b919082018092116102d557565b91909181156104d45760009180835260209082825265ffffffffffff95604095878787205416918215156000146104c1578387528185528787208961036b856102bd565b16885285528787205b848852828652888820848952865288882042815560018281015490820180546001600160a01b03199081166001600160a01b0393841617825560028501549395929490939092818110156104b65781039081116104a257600390925b60028701938455015492600386019384556103ec89888d6105e3565b1561041c575050505050505050835252209081549061040c818316610303565b169065ffffffffffff1916179055565b909192939495979699506104779c878c52888a528c8c209061043d8c6102bd565b168c5289528b8b20958603610479575b50505050505084528152838320918352522060036000918281558260018201558260028201550155565b565b60039442875560018701925416908254161790555460028401555491015538808080808061044d565b634e487b7160e01b8c52601160045260248cfd5b505060038b926103d0565b8185528787208780528552878720610374565b50505050565b909382156105dc5760009280845260209183835265ffffffffffff96604096888888205416928315156000146105c8578488528286528888208a61051d866102bd565b1689528652888820915b858952838752898920858a52875289892042815560018085015490820180546001600160a01b03199081166001600160a01b0393841617825592959194929391929091901561059d57610580600391600285015461031a565b9260028701938455015492600386019384556103ec89888d6105e3565b600283015490818110156105be5781039081116104a2576003905b926103d0565b505060038b6105b8565b828652888820888052865288882091610527565b5050505050565b600092835260205265ffffffffffff80604084205416908115159283610617575b5050506000146106115790565b50600190565b6020526040842092509061062a906102bd565b16825260205260408120544214388080610604565b848483610651939897959694986107b4565b94600095828752602091825260409065ffffffffffff828920911688528252808720938151608081019667ffffffffffffffff97828110898211176107a057906060929185528754908183528460018060a01b03928360018c01541694858a820152600360028d01549c8d8b840152015496879101521161079457160361078b5761078157815193637028a55d60e11b8552600485015260248401528183604481305afa948515610777578795610715575b5050505061071292935061031a565b90565b90918093949550913d841161076f575b601f8301601f191685019182118583101761075b57528201829003126107575761071292935051908392388080610703565b8380fd5b634e487b7160e01b88526041600452602488fd5b3d9250610725565b81513d89823e3d90fd5b5092955050505050565b50505050505050565b50505050505050505050565b634e487b7160e01b8b52604160045260248bfd5b926000838152602094855265ffffffffffff906040918083832054169687156108b857858152838320826107e78a6102bd565b1684528152848484205411156108c35786835285815283832083805281528484842054116108b85795949392919061081f82986102bd565b965b8189168289161161083757505050505050505090565b610855657fffffffffff61084b8b8b6102eb565b60011c16896102eb565b9889888552878352858520848216865283528585205487811460001461088357505050505050505050505090565b968098999a9b9394959697106000146108a6575050975b96959493929190610821565b9099506108b391506102bd565b61089a565b505094505050505090565b50505050505050610712906102bd56fea164736f6c6343000813000a";

type DelegationLogicLibraryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DelegationLogicLibraryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DelegationLogicLibrary__factory extends ContractFactory {
  constructor(...args: DelegationLogicLibraryConstructorParams) {
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
      DelegationLogicLibrary & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): DelegationLogicLibrary__factory {
    return super.connect(runner) as DelegationLogicLibrary__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DelegationLogicLibraryInterface {
    return new Interface(_abi) as DelegationLogicLibraryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): DelegationLogicLibrary {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as DelegationLogicLibrary;
  }
}
