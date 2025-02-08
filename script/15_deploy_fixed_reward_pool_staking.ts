import { ethers, upgrades } from 'hardhat';
require('dotenv').config();

async function main() {
  if (!process.env.DEVICE_NFT) {
    console.log(`Please provide DEVICE_NFT address`);
    return;
  }
  if (!process.env.START_TIME) {
    console.log(`Please provide START_TIME`);
    return;
  }
  if (!process.env.TOTAL_SECONDS) {
    console.log(`Please provide TOTAL_SECONDS`);
    return;
  }
  if (!process.env.REWARD_PER_SECOND) {
    console.log(`Please provide REWARD_PER_SECOND (unit: IOTX)`);
    return;
  }
  if (!process.env.SYSTEM_STAKING) {
    console.log(`Please provide SYSTEM_STAKING`);
    return;
  }

  let owner = (await ethers.getSigners())[0].address;
  if (process.env.OWNER) {
    owner = process.env.OWNER;
  }

  const ownedWeightedNFT = await ethers.deployContract('OwnedWeightedNFT', [process.env.DEVICE_NFT, owner]);
  await ownedWeightedNFT.waitForDeployment();

  const pool = await upgrades.deployProxy(
    await ethers.getContractFactory('FixedRewardPoolV3WithStaking'),
    [
      ownedWeightedNFT.target,
      process.env.START_TIME,
      ethers.parseEther(process.env.REWARD_PER_SECOND),
      process.env.TOTAL_SECONDS,
      process.env.SYSTEM_STAKING,
      91 * 86400,
      ethers.parseEther("0.0001")
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
