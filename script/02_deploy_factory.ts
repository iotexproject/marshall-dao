import { ethers } from 'hardhat';
import fs from 'fs';

// npx hardhat run script/02_deploy_factory.ts --network  testnet
async function main() {
  const poolFactory = await ethers.deployContract('EmptyPoolFactory', []);
  await poolFactory.waitForDeployment();
  console.log(`EmptyPoolFactory deployed to ${poolFactory.target}`);

  const gaugeFactory = await ethers.deployContract('GaugeFactory', []);
  await gaugeFactory.waitForDeployment();
  console.log(`GaugeFactory deployed to ${gaugeFactory.target}`);

  const incentiveFactory = await ethers.deployContract('IncentivesFactory', []);
  await incentiveFactory.waitForDeployment();
  console.log(`VotingRewardsFactory deployed to ${incentiveFactory.target}`);

  const factoryRegistry = await ethers.deployContract('FactoryRegistry', [poolFactory.target, incentiveFactory.target,gaugeFactory.target]);
  await factoryRegistry.waitForDeployment();
  console.log(`FactoryRegistry deployed to ${factoryRegistry.target}`);

  fs.appendFileSync('.env', `FACTORY_REGISTRY=${factoryRegistry.target}\n`);
  fs.appendFileSync('.env', `EMPTY_FACTORY=${poolFactory.target}\n`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
