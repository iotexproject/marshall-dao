import { ethers, upgrades } from 'hardhat';
require('dotenv').config();

async function main() {
  const vault = await upgrades.deployProxy(
    await ethers.getContractFactory('BatchClaimVault'),
    [ethers.parseEther('0.1')],
    {
      initializer: 'initialize',
    },
  );
  await vault.waitForDeployment();

  console.log(`BatchClaimVault deployed to ${vault.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
