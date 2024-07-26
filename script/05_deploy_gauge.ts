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
  if (!process.env.DeviceNFT) {
    console.log(`Please provide DeviceNFT address`);
    return;
  }

  const [deployer] = await ethers.getSigners();
  console.log('Deployer address:', deployer.address);
  const voter = await ethers.getContractAt('IVoter', process.env.VOTER, deployer);

  // 1. create erc20 gauge
  try {
    console.log('Calling createGauge with parameters:', process.env.EMPTY_FACTORY, process.env.LST_POOL1);
    const tx = await voter.createGauge(process.env.EMPTY_FACTORY, process.env.LST_POOL1, 0);
    console.log('Transaction hash:', tx.hash);
    // 等待交易确认
    await tx.wait();

    const deploy_gauge = await voter.gauges(process.env.LST_POOL1);
    console.log('deploy gauge: ', deploy_gauge);
    fs.appendFileSync('.env', `LST_GAUGE=${deploy_gauge}\n`)
    const lst_gauge = await ethers.getContractAt('IRewardGauge', deploy_gauge, deployer);
    const incentive = await lst_gauge.incentive();
    fs.appendFileSync('.env', `LST_Incentive=${incentive}\n`);
  } catch (error) {
    console.error('Error calling createGauge:', error);
  }

  // 2. create nft gauge
  try {
    const tx = await voter.createGauge(process.env.EMPTY_FACTORY, process.env.DeviceNFT, 1);
    console.log('Transaction hash:', tx.hash);
    // 等待交易确认
    await tx.wait();

    const deploy_gauge = await voter.gauges(process.env.DeviceNFT);
    console.log('deploy DeviceNFTGauge: ', deploy_gauge);
    fs.appendFileSync('.env', `DeviceNFT_GAUGE=${deploy_gauge}\n`)
    const device_gauge = await ethers.getContractAt('IRewardGauge', deploy_gauge, deployer);
    const incentive = await device_gauge.incentive();
    fs.appendFileSync('.env', `DeviceNFT_Incentive=${incentive}\n`);
  } catch (error) {
    console.error('Error calling createGauge:', error);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
