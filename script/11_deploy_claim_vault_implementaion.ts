import { ethers } from 'hardhat';
require('dotenv').config();

async function main() {
  if (!process.env.IOID_STORE) {
    console.log(`Please provide IOID_STORE address`);
    return;
  }

  const vault = await ethers.deployContract('PeriodClaimVault');
  await vault.waitForDeployment();

  console.log(`PeriodClaimVault implementation deployed to ${vault.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
