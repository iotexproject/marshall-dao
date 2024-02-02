import { ethers, upgrades } from 'hardhat';

async function main() {
  const forwarder = await ethers.deployContract('Forwarder');
  await forwarder.waitForDeployment();
  console.log(`Forwarder deployed to ${forwarder.target}`);

  const balanceLogicLibraryFactory = await ethers.getContractFactory('BalanceLogicLibrary');
  const balanceLogicLibrary = await balanceLogicLibraryFactory.deploy();
  await balanceLogicLibrary.waitForDeployment();
  console.log(`BalanceLogicLibrary deployed to ${balanceLogicLibrary.target}`);

  const delegationLogicLibraryFactory = await ethers.getContractFactory('DelegationLogicLibrary');
  const delegationLogicLibrary = await delegationLogicLibraryFactory.deploy();
  await delegationLogicLibrary.waitForDeployment();
  console.log(`DelegationLogicLibrary deployed to ${delegationLogicLibrary.target}`);

  const tokens = [];
  if (process.env.LST_ADDRESS) {
    tokens.push(process.env.LST_ADDRESS);
  }

  const VotingEscrow = await ethers.getContractFactory('VotingEscrow', {
    libraries: {
      BalanceLogicLibrary: balanceLogicLibrary.target,
      DelegationLogicLibrary: delegationLogicLibrary.target,
    },
  });
  const escrow = await upgrades.deployProxy(VotingEscrow, [tokens], {
    unsafeAllowLinkedLibraries: true,
    initializer: 'initialize',
  });
  console.log(`VotingEscrow deployed to ${escrow.target}`);

  const veArtProxy = await ethers.deployContract('VeArtProxy', [
    escrow.target,
    'https://nft.iotex.io/tokens/dao/ve.png',
  ]);
  console.log(`VeArtProxy deployed to ${veArtProxy.target}`);

  await escrow.setArtProxy(veArtProxy.target);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
