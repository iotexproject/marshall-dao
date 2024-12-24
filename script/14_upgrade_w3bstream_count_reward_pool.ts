import { ethers, upgrades } from 'hardhat';
import { W3bstreamCountRewardPool } from '../src/types';
require('dotenv').config();

async function main() {
  if (!process.env.REWARD_POOL) {
    console.log(`Please provide REWARD_POOL address`);
    return;
  }

  const poolFactory = await ethers.getContractFactory('W3bstreamCountRewardPool');
  const old = poolFactory.attach(process.env.REWARD_POOL) as W3bstreamCountRewardPool;

  const pool = await upgrades.upgradeProxy(process.env.REWARD_POOL, poolFactory, {
    redeployImplementation: 'always',
    constructorArgs: [await old.ioIDRegistry(), await old.MIN_INTERNAL()],
  });
  await pool.waitForDeployment();

  console.log(`W3bstreamCountRewardPool ${process.env.REWARD_POOL} upgraded`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
