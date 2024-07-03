import { ethers, upgrades } from 'hardhat';
const fs = require('fs');


async function main() {
  const forwarder = await ethers.deployContract('Forwarder');
  await forwarder.waitForDeployment();
  console.log(`Forwarder deployed to ${forwarder.target}`);
  fs.appendFileSync('.env', `FORWARDER=${forwarder.target}\n`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
