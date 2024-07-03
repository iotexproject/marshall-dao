import { ethers, upgrades } from 'hardhat';
require('dotenv').config();

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

  const rewardsDistributor = await ethers.deployContract('RewardsDistributor', [process.env.MSP]);
  await rewardsDistributor.waitForDeployment();
  console.log(`RewardsDistributor deployed to ${rewardsDistributor.target}`);

  const Vault = await ethers.getContractFactory('Vault');
  const vault = await upgrades.deployProxy(Vault, [voter.target, rewardsDistributor.target], {
    initializer: 'initialize',
  });
  await vault.waitForDeployment();
  console.log(`Vault deployed to ${vault.target}`);

  let tx = await voter.initialize([], vault.target);
  await tx.wait();

  tx = await rewardsDistributor.setVault(vault.target);
  await tx.wait();
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
