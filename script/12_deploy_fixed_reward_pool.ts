import { ethers, upgrades } from 'hardhat';
require('dotenv').config();

async function main() {
  if (!process.env.DEVICE_NFT) {
    console.log(`Please provide DEVICE_NFT address`);
    return;
  }
  if (!process.env.START_BLOCK) {
    console.log(`Please provide START_BLOCK`);
    return;
  }
  if (!process.env.TOTAL_BLOCKS) {
    console.log(`Please provide TOTAL_BLOCKS`);
    return;
  }
  if (!process.env.REWARD_PER_BLOCK) {
    console.log(`Please provide REWARD_PER_BLOCK (unit: IOTX)`);
    return;
  }

  let owner = (await ethers.getSigners())[0].address;
  if (process.env.OWNER) {
    owner = process.env.OWNER;
  }

  const ownedWeightedNFT = await ethers.deployContract('OwnedWeightedNFT', [process.env.DEVICE_NFT, owner]);
  await ownedWeightedNFT.waitForDeployment();

  const pool = await upgrades.deployProxy(
    await ethers.getContractFactory('FixedRewardPoolV2'),
    [
      ownedWeightedNFT.target,
      process.env.START_BLOCK,
      ethers.parseEther(process.env.REWARD_PER_BLOCK),
      process.env.TOTAL_BLOCKS,
    ],
    {
      initializer: 'initialize',
    },
  );
  await pool.waitForDeployment();

  console.log(`OwnedWeightedNFT for ${process.env.DEVICE_NFT} deployed to ${ownedWeightedNFT.target}`);
  console.log(`FixedRewardPool for ${process.env.DEVICE_NFT} deployed to ${pool.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
