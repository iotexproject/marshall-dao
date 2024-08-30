import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time, mine, mineUpTo } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('BatchClaimVault tests', function () {
  it('claim', async function () {
    const [owner, projectRecipient, fakeRecipient] = await ethers.getSigners();

    const vault = await ethers.deployContract('BatchClaimVault');
    await vault.connect(owner).initialize(ethers.parseEther('0.1'));

    expect(await vault.batchSize()).to.equal(17280);
    await expect(vault.connect(fakeRecipient).changeBatchSize(10)).to.revertedWith('Ownable: caller is not the owner');
    await expect(vault.connect(fakeRecipient).changeRewardPerBlock(10)).to.revertedWith(
      'Ownable: caller is not the owner',
    );
    await expect(vault.connect(fakeRecipient).changeRecipient(1, fakeRecipient.address)).to.revertedWith(
      'invalid admin',
    );

    await vault.connect(owner).changeBatchSize(10);

    const projectId = 1;
    await expect(vault.connect(projectRecipient).claim(projectId)).to.rejectedWith('invalid project');
    const startBlock = (await time.latestBlock()) + 2;
    await vault.connect(owner).addProject(projectId, projectRecipient.address, startBlock);

    await expect(vault.connect(owner).claim(projectId)).to.rejectedWith('claim too short');
    await expect(vault.connect(projectRecipient).claim(projectId)).to.rejectedWith('claim too short');

    await mine(10);
    await expect(vault.connect(projectRecipient).claim(projectId)).to.rejectedWith('insufficient fund');

    await vault.donate({ value: ethers.parseEther('1') });
    let claimBeforeBalance = await ethers.provider.getBalance(projectRecipient.address);
    let tx = await vault.connect(projectRecipient).claim(projectId);
    let claimAfterBalance = await ethers.provider.getBalance(projectRecipient.address);
    let receipt = await ethers.provider.getTransactionReceipt(tx.hash);
    expect(claimBeforeBalance).to.equals(
      claimAfterBalance - ethers.parseEther('1') + receipt!.gasUsed * receipt!.gasPrice,
    );

    await expect(vault.connect(projectRecipient).claim(projectId)).to.rejectedWith('claim too short');

    const lastClaimedBlock = await vault.lastClaimedBlock(projectId);
    await mineUpTo(lastClaimedBlock + BigInt(10));

    await expect(vault.connect(projectRecipient).claim(projectId)).to.rejectedWith('insufficient fund');
    await vault.donate({ value: ethers.parseEther('1') });
    claimBeforeBalance = await ethers.provider.getBalance(projectRecipient.address);
    tx = await vault.connect(projectRecipient).claim(projectId);
    claimAfterBalance = await ethers.provider.getBalance(projectRecipient.address);
    receipt = await ethers.provider.getTransactionReceipt(tx.hash);
    expect(claimBeforeBalance).to.equals(
      claimAfterBalance - ethers.parseEther('1') + receipt!.gasUsed * receipt!.gasPrice,
    );

    await vault.removeProject(projectId);
    await expect(vault.connect(projectRecipient).claim(projectId)).to.rejectedWith('invalid project');

    expect(await vault.lastClaimedBlock(projectId)).to.equals(0);
    expect(await vault.projectRecipient(projectId)).to.equals('0x0000000000000000000000000000000000000000');
  });
});
