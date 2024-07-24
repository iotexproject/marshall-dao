import { ethers } from 'hardhat';
import fs from "fs";

// npx hardhat run script/04_deploy_test.ts --network  testnet
async function main() {
  const lpToken = await ethers.deployContract('TestToken', ['Marshall Token', 'MT']);
  console.log(`TestToken deployed to ${lpToken.target}`);

  const incentiveToken = await ethers.deployContract('Incentive Token', ['IncentiveToken', 'IIT']);
  console.log(`IncentiveToken deployed to ${incentiveToken.target}`);

  const deviceNFTToken = await ethers.deployContract('TestDeviceNFT', ["DeviceNFT", "TestNFT"])
  console.log(`TestToken deployed to ${deviceNFTToken.target}`);

  fs.appendFileSync('.env', `DeviceNFT=${deviceNFTToken.target}\n`);
  fs.appendFileSync('.env', `LST_POOL1=${lpToken.target}\n`)
  fs.appendFileSync('.env', `INCENTIVE_TOKEN=${incentiveToken.target}\n`)
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
