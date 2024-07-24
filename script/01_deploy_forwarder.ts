import { ethers, upgrades } from 'hardhat';
const fs = require('fs');

// npx hardhat run script/01_deploy_forwarder.ts --network  testnet
async function main() {
  const forwarder = await ethers.deployContract('Forwarder');
  await forwarder.waitForDeployment();
  console.log(`Forwarder deployed to ${forwarder.target}`);
  fs.appendFileSync('.env', `\nFORWARDER=${forwarder.target}\n`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
