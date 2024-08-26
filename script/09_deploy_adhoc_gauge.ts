import { ethers, upgrades } from 'hardhat';
import fs from 'fs';
import { AdhocVoter } from '../src/types';
require('dotenv').config();

// npx hardhat run script/08_deploy_taxgauge_voter.ts --network  testnet
async function main() {
  if (!process.env.FORWARDER) {
    console.log(`Please provide FORWARDER address`);
    return;
  }
  if (!process.env.VOTER) {
    console.log(`Please provide VOTER address`);
    return;
  }

  const voterFactory = await ethers.getContractFactory('AdhocVoter');
  const adhocVoter = voterFactory.attach(process.env.VOTER) as AdhocVoter;

  const incentive = await ethers.deployContract('Incentives', [process.env.FORWARDER, adhocVoter.target, []]);
  await incentive.waitForDeployment();
  console.log(`Incentive deployed to ${incentive.target}`);

  let deviceNFT = process.env.DEVICE_NFT;

  if (!deviceNFT) {
    const deviceNFTToken = await ethers.deployContract('TestDeviceNFT', ['DeviceNFT', 'TestNFT']);
    await deviceNFTToken.waitForDeployment();
    // @ts-ignore
    deviceNFT = deviceNFTToken.target;
    console.log(`TestToken deployed to ${deviceNFTToken.target}`);
  }

  const deviceGauge = await ethers.deployContract('TaxDeviceGauge', [
    process.env.FORWARDER,
    deviceNFT,
    adhocVoter.target,
    incentive.target,
  ]);
  await deviceGauge.waitForDeployment();
  console.log(`DeviceGauge deployed to ${deviceGauge.target}`);

  const tx = await adhocVoter.addGauge(deviceGauge.target, incentive.target, 100);
  await tx.wait();
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
