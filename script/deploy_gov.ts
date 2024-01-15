import { ethers } from 'hardhat';

async function main() {
  if (!process.env.VE) {
    console.log(`Please provide VE address`);
    return;
  }

  const governor = await ethers.deployContract('MarshallGovernor', [process.env.VE]);
  await governor.waitForDeployment();
  console.log(`MarshallGovernor deployed to ${governor.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
