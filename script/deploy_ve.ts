import { ethers } from 'hardhat';

async function main() {
  const balanceLogicLibraryFactory = await ethers.getContractFactory('BalanceLogicLibrary');
  const balanceLogicLibrary = await balanceLogicLibraryFactory.deploy();
  await balanceLogicLibrary.waitForDeployment();
  console.log(`BalanceLogicLibrary deployed to ${balanceLogicLibrary.target}`);

  const delegationLogicLibraryFactory = await ethers.getContractFactory('DelegationLogicLibrary');
  const delegationLogicLibrary = await delegationLogicLibraryFactory.deploy();
  await delegationLogicLibrary.waitForDeployment();
  console.log(`DelegationLogicLibrary deployed to ${delegationLogicLibrary.target}`);

  const forwarder = await ethers.deployContract('Forwarder');
  await forwarder.waitForDeployment();
  console.log(`Forwarder deployed to ${forwarder.target}`);

  const escrow = await ethers.deployContract('VotingEscrow', [forwarder], {
    libraries: {
      BalanceLogicLibrary: balanceLogicLibrary.target,
      DelegationLogicLibrary: delegationLogicLibrary.target,
    }
  });
  console.log(`VotingEscrow deployed to ${escrow.target}`);

  const trigFactory = await ethers.getContractFactory('Trig');
  const trig = await trigFactory.deploy();
  await trig.waitForDeployment();
  console.log(`Trig deployed to ${trig.target}`);
  const perlinNoiseFactory = await ethers.getContractFactory('PerlinNoise');
  const perlinNoise = await perlinNoiseFactory.deploy();
  await perlinNoise.waitForDeployment();

  console.log(`PerlinNoise deployed to ${perlinNoise.target}`);
  const veArtProxy = await ethers.deployContract('VeArtProxy', [escrow.target], {
    libraries: {
      Trig: trig.target,
      PerlinNoise: perlinNoise.target,
    }
  });
  console.log(`VeArtProxy deployed to ${veArtProxy.target}`);

  await escrow.setArtProxy(veArtProxy.target);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
