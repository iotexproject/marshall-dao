import * as dotenv from 'dotenv'
import "@nomicfoundation/hardhat-toolbox";

import importToml from 'import-toml'
// @ts-ignore
const foundryConfig = importToml.sync('foundry.toml').profile

dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const accounts = PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : []

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    dev: {
      url: "http://127.0.0.1:8545",
      accounts: accounts,
    },
    mainnet: {
      url: "https://babel-api.mainnet.iotex.io/",
      accounts: accounts,
    },
    testnet: {
      url: "https://babel-api.testnet.iotex.io/",
      accounts: accounts,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    admin: {
      default: 1,
    },
  },
  solidity: {
    compilers: [{
      version: "0.8.19",
      settings: {
        viaIR: foundryConfig.default.via_ir,
        optimizer: {
          enabled: true,
          runs: foundryConfig.default.optimizer_runs,
        },
        metadata: {
          bytecodeHash: 'none',
        },
      }
    }]
  },
  typechain: {
    outDir: "src/types"
  },
}
