import { ethers } from 'hardhat';

async function main() {
  if (!process.env.VE) {
    console.log(`Please provide VE address`);
    return;
  }
  if (!process.env.FORWARDER) {
    console.log(`Please provide FORWARDER address`);
    return;
  }
  if (!process.env.FACTORY_REGISTRY) {
    console.log(`Please provide FACTORY_REGISTRY address`);
    return;
  }
  if (!process.env.FACTORY_REGISTRY) {
    console.log(`Please provide FACTORY_REGISTRY address`);
    return;
  }
  if (!process.env.GOVERNOR) {
    console.log(`Please provide GOVERNOR address`);
    return;
  }

  const voter = await ethers.deployContract('Voter', [
    process.env.FORWARDER,
    process.env.VE,
    process.env.FACTORY_REGISTRY
  ]);
  await voter.waitForDeployment();
  console.log(`Voter deployed to ${voter.target}`);

  let tx = await voter.setGovernor(process.env.GOVERNOR);
  await tx.wait();

  const rewardsDistributor = await ethers.deployContract('RewardsDistributor', [
    process.env.VE
  ]);
  await rewardsDistributor.waitForDeployment();
  console.log(`RewardsDistributor deployed to ${rewardsDistributor.target}`);
  
  const minter = await ethers.deployContract('Minter', [
    voter.target,
    process.env.VE,
    rewardsDistributor.target
  ]);
  await minter.waitForDeployment();
  console.log(`Minter deployed to ${minter.target}`);

  tx = await voter.initialize([], minter.target);
  await tx.wait();

  tx = await rewardsDistributor.setMinter(minter.target);
  await tx.wait();
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
