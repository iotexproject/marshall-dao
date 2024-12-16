import { ethers, upgrades } from 'hardhat';
require('dotenv').config();

async function main() {
  if (!process.env.IOID_REGISTRY) {
    console.log(`Please provide IOID_REGISTRY address`);
    return;
  }
  if (!process.env.REWARD_PERIOD) {
    console.log(`Please provide REWARD_PERIOD (unit: second)`);
    return;
  }
  if (!process.env.ACTIVE_PERIOD_LIMIT) {
    console.log(`Please provide ACTIVE_PERIOD_LIMIT`);
    return;
  }
  if (!process.env.REWARD_PER_PERIOD) {
    console.log(`Please provide REWARD_PER_PERIOD (unit: IOTX)`);
    return;
  }
  if (!process.env.MIN_INTERNAL) {
    console.log(`Please provide MIN_INTERNAL (unit: second)`);
    return;
  }
  if (!process.env.PROJECT_ID) {
    console.log(`Please provide PROJECT_ID`);
    return;
  }
  if (!process.env.DAPP) {
    console.log(`Please provide DAPP address`);
    return;
  }

  const pool = await upgrades.deployProxy(
    await ethers.getContractFactory('W3bstreamCountRewardPool'),
    [
      process.env.REWARD_PERIOD,
      process.env.ACTIVE_PERIOD_LIMIT,
      ethers.parseEther(process.env.REWARD_PER_PERIOD),
      process.env.PROJECT_ID,
      process.env.DAPP,
    ],
    {
      constructorArgs: [process.env.IOID_REGISTRY, process.env.MIN_INTERNAL],
      initializer: 'initialize',
    },
  );
  await pool.waitForDeployment();

  console.log(`W3bstreamCountRewardPool for project ${process.env.PROJECT_ID} deployed to ${pool.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
