// import { ethers } from 'hardhat';
const { ethers } = require("hardhat")
import fs from 'fs';

// npx hardhat run script/06_deploy_deposit.ts --network  testnet
async function main() {
    if (!process.env.LST_GAUGE) {
        console.log(`Please provide LST_GAUGE address`);
        return;
    }
    if (!process.env.LST_POOL1) {
        console.log(`Please provide LST_Token address`);
        return;
    }

    const [deployer] = await ethers.getSigners();
    console.log('Deployer address:', deployer.address);

    const lst_token = await ethers.getContractAt('TestToken', process.env.LST_POOL1)
    const tx = await lst_token.approve(process.env.LST_GAUGE, ethers.parseEther('1000'));
    await tx.wait();
    const gauge = await ethers.getContractAt('IRewardGauge', process.env.LST_GAUGE, deployer);
    const tx2 = await gauge.deposit(ethers.parseEther('1'));
    await tx2.wait();

    const balance = await gauge.balanceOf(deployer);
    console.log("balance of deposit: ", balance);

}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
