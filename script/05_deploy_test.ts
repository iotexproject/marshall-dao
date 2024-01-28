import { ethers } from 'hardhat';

async function main() {
  const token = await ethers.deployContract('TestToken', ['Marshall Token', 'MT']);
  console.log(`TestToken deployed to ${token.target}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
