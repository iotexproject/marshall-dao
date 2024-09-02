import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('PeriodClaimVault tests', function () {
  it('claim', async function () {
    const [owner, fakeRecipient] = await ethers.getSigners();

    const ioIDStore = await ethers.deployContract('TestIoIDStore');
    const vault = await ethers.deployContract('PeriodClaimVault');
    await vault.connect(owner).initialize(ioIDStore.target, ethers.parseEther('0.1'));

    expect(await vault.period()).to.equal(86400);
    expect(await vault.rewardPerDevice()).to.equal(ethers.parseEther('0.1'));
    await expect(vault.connect(fakeRecipient).changePeriod(10)).to.revertedWith('Ownable: caller is not the owner');
    await expect(vault.connect(fakeRecipient).changeRewardPerDevice(10)).to.revertedWith(
      'Ownable: caller is not the owner',
    );
    await expect(vault.connect(fakeRecipient).changeRecipient(1, fakeRecipient.address)).to.revertedWith(
      'invalid admin',
    );

    await expect(vault.setInvalidDevice(1, 10)).to.revertedWith('invalid project');
    expect(await vault.projectInvalidDevice(1)).to.be.equals(0);
    await ioIDStore.setProjectActivedAmount(1, 5);
    await ioIDStore.setProjectDeviceContract(1, '0x0000000000000000000000000000000000000001');
    await expect(vault.setInvalidDevice(1, 10)).to.revertedWith('invalid project');
    expect(await vault.projectInvalidDevice(1)).to.be.equals(0);
    await vault.setInvalidDevice(1, 2);
    expect(await vault.projectInvalidDevice(1)).to.be.equals(2);
    await vault.setInvalidDevice(1, 0);
    expect(await vault.projectInvalidDevice(1)).to.be.equals(0);

    const latestBlock = await ethers.provider.getBlock('latest');
    const startTimestamp = latestBlock!.timestamp + 2000;

    const projectId = 1;
    const projectRecipient = '0x0000000000000000000000000000000000000100';
    await expect(vault.addProject(2, projectRecipient, startTimestamp)).to.revertedWith('invalid project');
    await vault.addProject(projectId, projectRecipient, startTimestamp);
    await expect(vault.addProject(projectId, projectRecipient, startTimestamp)).to.revertedWith('already added');

    expect(await vault.lastClaimedTimestamp(projectId)).to.be.equals(startTimestamp);
    await expect(vault.claim(projectId)).to.revertedWith('claim too short');
    await time.increaseTo(startTimestamp + 86000);
    await expect(vault.claim(projectId)).to.revertedWith('claim too short');
    await time.increaseTo(startTimestamp + 86400);

    await vault.donate({ value: ethers.parseEther('100') });
    await vault.claim(projectId);
    expect(await ethers.provider.getBalance(projectRecipient)).to.be.equals(
      (await ioIDStore.projectActivedAmount(projectId)) * (await vault.rewardPerDevice()),
    );
    await expect(vault.claim(projectId)).to.revertedWith('claim too short');

    await vault.setInvalidDevice(projectId, 2);
    await expect(vault.claim(projectId)).to.revertedWith('claim too short');
    await time.increaseTo(startTimestamp + 86400 * 2 + 5000);
    let balanceRecipient = await ethers.provider.getBalance(projectRecipient);
    await vault.claim(projectId);
    expect((await ethers.provider.getBalance(projectRecipient)) - balanceRecipient).to.be.equals(
      ((await ioIDStore.projectActivedAmount(projectId)) - (await vault.projectInvalidDevice(projectId))) *
        (await vault.rewardPerDevice()),
    );

    await time.increaseTo(startTimestamp + 86400 * 5 + 50000);
    await vault.connect(fakeRecipient).claim(projectId);
    expect((await ethers.provider.getBalance(projectRecipient)) - balanceRecipient).to.be.equals(
      ((await ioIDStore.projectActivedAmount(projectId)) - (await vault.projectInvalidDevice(projectId))) *
        (await vault.rewardPerDevice()) *
        BigInt(4),
    );

    await vault.removeProject(projectId);
    await expect(vault.claim(projectId)).to.revertedWith('invalid project');
  });
});
