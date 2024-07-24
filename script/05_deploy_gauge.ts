import { ethers } from 'hardhat';
import fs from "fs";
require('dotenv').config();

// npx hardhat run script/05_deploy_gauge.ts --network  testnet
async function main() {
  if (!process.env.VOTER) {
    console.log(`Please provide VOTER address`);
    return;
  }
  if (!process.env.EMPTY_FACTORY) {
    console.log(`Please provide EMPTY_FACTORY address`);
    return;
  }
  if (!process.env.LST_POOL1) {
    console.log(`Please provide LST address`);
    return;
  }

  const [deployer] = await ethers.getSigners();
  console.log('Deployer address:', deployer.address);

  const voter = await ethers.getContractAt('IVoter', process.env.VOTER, deployer);

  const result = await voter.governor();
  console.log('governor in voter contract is:', result);
  const registry = await voter.factoryRegistry();
  console.log('factoryRegistry in voter contract is:', registry);
  const factoryRegistry = await ethers.getContractAt('IFactoryRegistry', registry, deployer);
  const gauge = await factoryRegistry.factoriesToPoolFactory(process.env.EMPTY_FACTORY);
  console.log('gaugeFactory in factoryRegistry is:', gauge);
  const factories = await factoryRegistry.poolFactories();
  console.log('factories in factoryRegistry is:', factories);
  const deploy_gauge = await voter.gauges(process.env.LST_POOL1);
  console.log('deploy gauge: ', deploy_gauge);

  try {
    console.log('Calling createGauge with parameters:', process.env.EMPTY_FACTORY, process.env.LST_POOL1);
    const tx = await voter.createGauge(process.env.EMPTY_FACTORY, process.env.LST_POOL1);
    console.log('Transaction hash:', tx.hash);
    // 等待交易确认
    const receipt = await tx.wait();

    const deploy_gauge = await voter.gauges(process.env.LST_POOL1);
    console.log('deploy gauge: ', deploy_gauge);
    fs.appendFileSync('.env', `LST_GAUGE=${deploy_gauge}\n`)
    const lst_gauge = await ethers.getContractAt('IRewardGauge', deploy_gauge, deployer);
    const incentive = await lst_gauge.incentive();
    fs.appendFileSync('.env', `LST_Incentive=${incentive}\n`);
  } catch (error) {
    console.error('Error calling createGauge:', error);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
