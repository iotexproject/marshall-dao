import { ethers } from 'hardhat';
import fs from 'fs';

async function main() {
  const poolFactory = await ethers.deployContract('EmptyPoolFactory', []);
  await poolFactory.waitForDeployment();
  console.log(`EmptyPoolFactory deployed to ${poolFactory.target}`);

  const gaugeFactory = await ethers.deployContract('GaugeFactory', []);
  await gaugeFactory.waitForDeployment();
  console.log(`GaugeFactory deployed to ${gaugeFactory.target}`);

  const factoryRegistry = await ethers.deployContract('FactoryRegistry', [poolFactory.target, gaugeFactory.target]);
  await factoryRegistry.waitForDeployment();
  console.log(`FactoryRegistry deployed to ${factoryRegistry.target}`);

  fs.appendFileSync('.env', `FACTORY_REGISTRY=${factoryRegistry.target}\n`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
