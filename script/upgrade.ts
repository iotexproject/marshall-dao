import { ethers, upgrades } from 'hardhat';

async function main() {
  if (process.env.CLAIM_VAULT) {
    console.log(`upgrade claim vault`);
    const vault = await ethers.getContractFactory('BatchClaimVault');
    await upgrades.forceImport(process.env.CLAIM_VAULT, vault);
    await upgrades.upgradeProxy(process.env.CLAIM_VAULT, vault, {
      redeployImplementation: 'always',
    });
    console.log(`Upgrade BatchClaimVault ${process.env.CLAIM_VAULT} successfull!`);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});