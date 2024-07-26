const { ethers } = require("hardhat")

// npx hardhat run script/07_calculate_boost.ts --network  testnet
async function main() {
    if (!process.env.LST_GAUGE) {
        console.log(`Please provide LST_GAUGE address`);
        return;
    }

    const [deployer] = await ethers.getSigners();
    console.log('Deployer address:', deployer.address);

    const gauge = await ethers.getContractAt('IRewardGauge', process.env.LST_GAUGE, deployer);
    const totalSupply = await gauge.totalSupply();
    const totalShare = await gauge.totalShare();

    const userWillDepositLp =  BigInt(10000);
    const userWillVoteShare = BigInt(100) ;
    var boost = Number(1.5) * Number((totalSupply+userWillDepositLp) *userWillVoteShare)/Number(totalShare+userWillVoteShare)/Number(userWillDepositLp) + Number(1)
    if (boost > Number(2.5)){
        boost = Number(2.5)
    }
    console.log("boost for user: ", boost);
}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
