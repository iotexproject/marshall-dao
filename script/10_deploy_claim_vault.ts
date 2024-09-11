import { ethers, upgrades } from 'hardhat';
require('dotenv').config();

async function main() {
  if (!process.env.IOID_STORE) {
    console.log(`Please provide IOID_STORE address`);
    return;
  }

  const vault = await upgrades.deployProxy(
    await ethers.getContractFactory('PeriodClaimVault'),
    [process.env.IOID_STORE],
    {
      initializer: 'initialize',
    },
  );
  await vault.waitForDeployment();

  console.log(`PeriodClaimVault deployed to ${vault.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
