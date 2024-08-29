import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe('Adhoc test flow', function () {
  it('staking', async function () {
    const [deployer] = await ethers.getSigners();
    const forwarder = await ethers.deployContract('Forwarder');
  
    const adhocVoter = await ethers.deployContract('AdhocVoter');
    await adhocVoter.initialize();
    const incentive = await ethers.deployContract('Incentives', [forwarder.target, adhocVoter.target, []]);

    const deviceNFT = await ethers.deployContract('TestDeviceNFT', ['DeviceNFT', 'TestNFT']);

    const taxDeviceGauge = await ethers.deployContract('TaxDeviceGauge', [
      forwarder.target,
      deviceNFT.target,
      adhocVoter.target,
      incentive.target,
    ]);
    await adhocVoter.addGauge(taxDeviceGauge.target, incentive.target, 100);

    expect(await taxDeviceGauge.totalSupply()).to.equal(0);
    expect(await taxDeviceGauge.balanceOf(deployer.address)).to.equal(0);
    await deviceNFT.approve(taxDeviceGauge.target, 1);
    await taxDeviceGauge['deposit(uint256,address)'](1, deployer.address);
    expect(await taxDeviceGauge.totalSupply()).to.equal(100);
    expect(await taxDeviceGauge.balanceOf(deployer.address)).to.equal(100);

    await adhocVoter.changeWeekly(ethers.parseEther('1.0'));
    await adhocVoter.donate({value: ethers.parseEther('10.0')});

    await time.increase(24*60*60*7);

    expect(await taxDeviceGauge.earned(deployer.address)).to.equal(0);
    expect(await ethers.provider.getBalance(taxDeviceGauge.target)).to.equal(0);
    expect(await taxDeviceGauge.weightedBalanceOf(deployer.address)).to.equal(40);
    expect(await taxDeviceGauge.userRewardPerTokenPaid(deployer.address)).to.equal(0);

    await adhocVoter.changeTaxer(taxDeviceGauge.target, deployer.address);
    await adhocVoter.changeTaxRatio(taxDeviceGauge.target, 20);
    await adhocVoter.emitReward();

    await time.increase(24*60*60*1);

    expect(await taxDeviceGauge.rewardRate()).to.gt(0);
    expect(await taxDeviceGauge.taxAmount(deployer.address)).to.gt(0);
    expect(await taxDeviceGauge.totalWeightedBalance()).to.equal(40);
    expect(await taxDeviceGauge.weightedBalanceOf(deployer.address)).to.equal(40);
    expect(await taxDeviceGauge.userRewardPerTokenPaid(deployer.address)).to.equal(0);
    expect(await taxDeviceGauge.earned(deployer.address)).to.gt(0);
    expect(await ethers.provider.getBalance(taxDeviceGauge.target)).to.equal(ethers.parseEther('1.0'));
  });
});
