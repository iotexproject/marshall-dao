import { expect } from 'chai';
import { ethers } from 'hardhat';
import { address } from 'hardhat/internal/core/config/config-validation';

describe('Flow', function () {
  it('Vote flow', async function () {
    const [deployer] = await ethers.getSigners();
    const forwarder = await ethers.deployContract('Forwarder');
    const poolFactory = await ethers.deployContract('EmptyPoolFactory', []);
    const incentiveFactory = await ethers.deployContract('IncentivesFactory', []);
    const gaugeFactory = await ethers.deployContract('GaugeFactory', []);
    const factoryRegistry = await ethers.deployContract('FactoryRegistry', [
      poolFactory.target,
      incentiveFactory.target,
      gaugeFactory.target,
    ]);
    const strategyManager = await ethers.deployContract('TestStrategyManager');
    await strategyManager.setShare(deployer.address, 100);
    const voter = await ethers.deployContract('Voter', [
      forwarder.target,
      strategyManager.target,
      factoryRegistry.target,
    ]);

    const vault = await ethers.deployContract('Vault');
    await vault.initialize(voter.target, strategyManager.target);

    await voter.initialize([], vault.target);

    const token = await ethers.deployContract('TestToken', ['Test Token', 'TEST']);
    await voter.createGauge(poolFactory.target, token.target);

    await voter.vote([token.target], [5000]);
  });
});
