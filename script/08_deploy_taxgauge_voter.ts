import {ethers, upgrades} from 'hardhat';
import fs from "fs";
require('dotenv').config();

// npx hardhat run script/08_deploy_taxgauge_voter.ts --network  testnet
async function main() {
  if (!process.env.FORWARDER) {
    console.log(`Please provide VOTER address`);
    return;
  }
  if (!process.env.DeviceNFT) {
    console.log(`Please provide EMPTY_FACTORY address`);
    return;
  }

  const AdhocVoter = await ethers.getContractFactory('AdhocVoter');
  const adhocVoter = await upgrades.deployProxy(AdhocVoter, [], {
    initializer: 'initialize',
  });
  await adhocVoter.waitForDeployment();
  console.log(`AdhocVoter deployed to ${adhocVoter.target}`);

  const incentive = await ethers.deployContract('Incentives', [
    process.env.FORWARDER, adhocVoter.target, []]);
  await incentive.waitForDeployment();
  console.log(`Incentive deployed to ${incentive.target}`);

  const deviceNFTToken = await ethers.deployContract('TestDeviceNFT', ["DeviceNFT", "TestNFT"])
  await deviceNFTToken.waitForDeployment();
  console.log(`TestToken deployed to ${deviceNFTToken.target}`);

  const taxDeviceGauge = await ethers.deployContract('TaxDeviceGauge', [
      process.env.FORWARDER, deviceNFTToken.target, adhocVoter.target, incentive.target]);
  await taxDeviceGauge.waitForDeployment();
  console.log(`taxDeviceGauge deployed to ${taxDeviceGauge.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
