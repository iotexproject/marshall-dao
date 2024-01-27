import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('VotingEscrow', function () {
  it('Native bucket Mapping', async function () {
    const accounts = await ethers.getSigners();
    const forwarder = await ethers.deployContract('Forwarder');
    const b = await ethers.deployContract('BalanceLogicLibrary');
    const d = await ethers.deployContract('DelegationLogicLibrary');
    const ve = await ethers.deployContract('VotingEscrow', [forwarder.target, []], {
      signer: accounts[0],
      libraries: {
        BalanceLogicLibrary: b.target,
        DelegationLogicLibrary: d.target,
      },
    });

    const now = Math.floor(new Date().getTime() / 1000);
    const oneYear = now + 60 * 60 * 24 * 365;

    const root = ethers.keccak256(
      ethers.solidityPacked(
        // bucketId, voter, end, amount
        ['uint256', 'address', 'uint256', 'uint256'],
        [200, accounts[1].address, oneYear, ethers.parseEther('100')],
      ),
    );

    await expect(ve.connect(accounts[1]).commitNativeRoot(root)).to.be.revertedWithCustomError(ve, 'NotTeam');
    await ve.connect(accounts[0]).commitNativeRoot(root);
    await ve.connect(accounts[0]).approveNativeRoot();

    expect(await ve.nativeRoot()).to.equal(root);

    expect(await ve.ownerOf(1)).to.equal('0x0000000000000000000000000000000000000000');
    await ve.connect(accounts[2]).claimNative(200, accounts[1].address, oneYear, ethers.parseEther('100'), []);
    expect(await ve.ownerOf(1)).to.equal(accounts[1].address);
    const locked = await ve.locked(1);
    expect(locked.amount).to.equal(ethers.parseEther('100'));
    expect(locked.isPermanent).to.equal(false);
    expect(await ve.nativeTokenId(200)).to.equal(1);
    expect(await ve.tokenIdNative(1)).to.equal(200);
  });
});
