import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Flow', function () {
  it('Vote flow', async function () {
    const forwarder = await ethers.deployContract('Forwarder');
    const b = await ethers.deployContract('BalanceLogicLibrary');
    const d = await ethers.deployContract('DelegationLogicLibrary');
    const ve = await ethers.deployContract('VotingEscrow', [forwarder.target, []], {
      libraries: {
        BalanceLogicLibrary: b.target,
        DelegationLogicLibrary: d.target,
      },
    });

    let tx = await ve.createLock('0x0000000000000000000000000000000000000000', '10000000000000000000', 126144000, {
      value: '10000000000000000000',
    });
    await tx.wait();
    await expect(
      ve.createLock('0x0000000000000000000000000000000000000000', '10000000000000000000', 126144000, {
        value: '20000000000000000',
      }),
    ).to.be.revertedWithCustomError(ve, 'InvalidAmount');

    const poolFactory = await ethers.deployContract('EmptyPoolFactory', []);
    const votingRewardsFactory = await ethers.deployContract('VotingRewardsFactory', []);
    const gaugeFactory = await ethers.deployContract('GaugeFactory', []);
    const factoryRegistry = await ethers.deployContract('FactoryRegistry', [
      poolFactory.target,
      votingRewardsFactory.target,
      gaugeFactory.target,
    ]);

    const voter = await ethers.deployContract('Voter', [forwarder.target, ve.target, factoryRegistry.target]);

    const rewardsDistributor = await ethers.deployContract('RewardsDistributor', [ve.target]);
    await rewardsDistributor.waitForDeployment();

    const vault = await ethers.deployContract('Vault', [voter.target, ve.target, rewardsDistributor.target]);

    await voter.initialize([], vault.target);
    await rewardsDistributor.setVault(vault.target);

    const token = await ethers.deployContract('TestToken', ['Test Token', 'TEST']);
    await voter.createGauge(poolFactory.target, token.target);

    await ve.setVoter(voter.target);
    await voter.vote(1, [token.target], [5000]);
  });
});
