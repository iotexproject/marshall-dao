import { ethers } from 'hardhat';

async function main() {
  const poolFactory = await ethers.deployContract('EmptyPoolFactory', []);
  await poolFactory.waitForDeployment();
  console.log(`EmptyPoolFactory deployed to ${poolFactory.target}`);

  const votingRewardsFactory = await ethers.deployContract('VotingRewardsFactory', []);
  await votingRewardsFactory.waitForDeployment();
  console.log(`VotingRewardsFactory deployed to ${votingRewardsFactory.target}`);

  const gaugeFactory = await ethers.deployContract('GaugeFactory', []);
  await gaugeFactory.waitForDeployment();
  console.log(`GaugeFactory deployed to ${gaugeFactory.target}`);

  const factoryRegistry = await ethers.deployContract('FactoryRegistry', [
    poolFactory.target,
    votingRewardsFactory.target,
    gaugeFactory.target,
  ]);
  await factoryRegistry.waitForDeployment();
  console.log(`FactoryRegistry deployed to ${factoryRegistry.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
