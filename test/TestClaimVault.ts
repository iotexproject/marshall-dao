import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time, mine } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe('BatchClaimVault tests', function () {
  it('claim', async function () {
    const [owner, projectOperator, fakeOperator] = await ethers.getSigners();
    
    const vault = await ethers.deployContract('BatchClaimVault');
    await vault.connect(owner).initialize(ethers.parseEther('0.1'));
    
    expect(await vault.batchSize()).to.equal(17280);
    await expect(vault.connect(fakeOperator).changeBatchSize(10))
        .to.revertedWith('Ownable: caller is not the owner');
    await expect(vault.connect(fakeOperator).changeRewardPerBlock(10))
        .to.revertedWith('Ownable: caller is not the owner');
    await expect(vault.connect(fakeOperator).changeOperator(1, fakeOperator.address))
        .to.revertedWith('invalid operator');

    await vault.connect(owner).changeBatchSize(10);

    const startBlock = (await time.latestBlock() + 2);
    const projectId = 1;
    await vault.connect(owner).addProject(projectId, projectOperator.address, startBlock);

    await expect(vault.connect(owner).claim(projectId)).to.rejectedWith('invalid operator');
    await expect(vault.connect(projectOperator).claim(projectId)).to.rejectedWith('claim too short');
    
    await mine(10);
    await expect(vault.connect(projectOperator).claim(projectId)).to.rejectedWith('insufficient fund');

    await vault.donate({value: ethers.parseEther("1")});
    const claimBeforeBalance = await ethers.provider.getBalance(projectOperator.address);
    const tx = await vault.connect(projectOperator).claim(projectId);
    const claimAfterBalance = await ethers.provider.getBalance(projectOperator.address);
    const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
    expect(claimBeforeBalance).to.equals(claimAfterBalance - ethers.parseEther("1") + receipt!.gasUsed * receipt!.gasPrice);

    await expect(vault.connect(projectOperator).claim(projectId)).to.rejectedWith('claim too short');
  })
})
