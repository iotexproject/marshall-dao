import { ethers } from 'hardhat';

async function main() {
  const poolFactory = await ethers.deployContract('EmptyPoolFactory', []);
  console.log(`EmptyPoolFactory deployed to ${poolFactory.target}`);
  const votingRewardsFactory = await ethers.deployContract('VotingRewardsFactory', []);
  console.log(`VotingRewardsFactory deployed to ${votingRewardsFactory.target}`);
  const gaugeFactory = await ethers.deployContract('GaugeFactory', []);
  console.log(`GaugeFactory deployed to ${gaugeFactory.target}`);
  
  const factoryRegistry = await ethers.deployContract('FactoryRegistry', [
    poolFactory.target,
    votingRewardsFactory.target,
    gaugeFactory.target
  ]);
  console.log(`FactoryRegistry deployed to ${factoryRegistry.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
