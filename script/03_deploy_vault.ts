import { ethers, upgrades } from 'hardhat';
require('dotenv').config();
import fs from 'fs';

// npx hardhat run script/03_deploy_vault.ts --network  testnet
async function main() {
  if (!process.env.FORWARDER) {
    console.log(`Please provide FORWARDER address`);
    return;
  }
  if (!process.env.FACTORY_REGISTRY) {
    console.log(`Please provide FACTORY_REGISTRY address`);
    return;
  }
  if (!process.env.MSP) {
    console.log(`Please provide MSP address`);
    return;
  }

  const voter = await ethers.deployContract('Voter', [
    process.env.FORWARDER,
    process.env.MSP,
    process.env.FACTORY_REGISTRY,
  ]);
  await voter.waitForDeployment();
  console.log(`Voter deployed to ${voter.target}`);

  const Vault = await ethers.getContractFactory('Vault');
  const vault = await upgrades.deployProxy(Vault, [voter.target, process.env.MSP], {
    initializer: 'initialize',
  });
  await vault.waitForDeployment();
  console.log(`Vault deployed to ${vault.target}`);

  let tx = await voter.initialize([], vault.target);
  await tx.wait();

  fs.appendFileSync('.env', `VOTER=${voter.target}\n`);
  fs.appendFileSync('.env', `VAULT=${voter.target}\n`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
