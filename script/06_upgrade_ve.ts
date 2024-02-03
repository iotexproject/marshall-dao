import { ethers, upgrades } from 'hardhat';

async function main() {
  if (!process.env.VE) {
    console.log(`Please provide VE address`);
    return;
  }
  if (!process.env.BALANCELOGICLIBRARY) {
    console.log(`Please provide BALANCELOGICLIBRARY address`);
    return;
  }
  if (!process.env.DELEGATIONLOGICLIBRARY) {
    console.log(`Please provide DELEGATIONLOGICLIBRARY address`);
    return;
  }

  const VotingEscrow = await ethers.getContractFactory('VotingEscrow', {
    libraries: {
      BalanceLogicLibrary: process.env.BALANCELOGICLIBRARY,
      DelegationLogicLibrary: process.env.DELEGATIONLOGICLIBRARY,
    },
  });
  await upgrades.forceImport(process.env.VE, VotingEscrow);
  await upgrades.upgradeProxy(process.env.VE, VotingEscrow, {
    unsafeAllowLinkedLibraries: true,
  });
  console.log(`Upgrade VotingEscrow ${process.env.VE} successfull!`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
