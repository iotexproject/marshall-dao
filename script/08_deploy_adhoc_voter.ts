import { ethers, upgrades } from 'hardhat';
import fs from 'fs';
require('dotenv').config();

// npx hardhat run script/08_deploy_taxgauge_voter.ts --network  testnet
async function main() {
  if (!process.env.FORWARDER) {
    console.log(`Please provide FORWARDER address`);
    return;
  }

  const AdhocVoter = await ethers.getContractFactory('AdhocVoter');
  const adhocVoter = await upgrades.deployProxy(AdhocVoter, [], {
    initializer: 'initialize',
  });
  await adhocVoter.waitForDeployment();
  console.log(`AdhocVoter deployed to ${adhocVoter.target}`);

  /*
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

  const taxDeviceGauge = await ethers.deployContract('TaxDeviceGauge', [
    process.env.FORWARDER,
    deviceNFT,
    adhocVoter.target,
    incentive.target,
  ]);
  await taxDeviceGauge.waitForDeployment();
  console.log(`taxDeviceGauge deployed to ${taxDeviceGauge.target}`);

  const tx = await adhocVoter.addGauge(taxDeviceGauge.target, incentive.target, 100);
  await tx.wait();
  */
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});