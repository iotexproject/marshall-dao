import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { VotingEscrow } from '../src/types';

describe('VotingEscrow', function () {
  let accounts: HardhatEthersSigner[];
  let ve: VotingEscrow;
  let now: number;
  const WEEK = 60 * 60 * 24 * 7;
  const YEAR = 60 * 60 * 24 * 365;

  before(async function () {
    accounts = await ethers.getSigners();
    const forwarder = await ethers.deployContract('Forwarder');
    const balanceLogic = await ethers.deployContract('BalanceLogicLibrary');
    const delegationLogic = await ethers.deployContract('DelegationLogicLibrary');
    ve = await ethers.deployContract('VotingEscrow', [forwarder.target, []], {
      signer: accounts[0],
      libraries: {
        BalanceLogicLibrary: balanceLogic.target,
        DelegationLogicLibrary: delegationLogic.target,
      },
    });
  });

  beforeEach(function () {
    now = Math.floor(new Date().getTime() / 1000);
  });

  it('Native bucket Mapping', async function () {
    const bucketId = 200;
    const voter = accounts[1].address;
    const end = now + YEAR;
    const stakedAmount = ethers.parseEther('100');
    const root = ethers.keccak256(
      ethers.solidityPacked(['uint256', 'address', 'uint256', 'uint256'], [bucketId, voter, end, stakedAmount]),
    );

    await expect(ve.connect(accounts[1]).commitNativeRoot(root)).to.be.revertedWithCustomError(ve, 'NotTeam');
    await ve.connect(accounts[0]).commitNativeRoot(root);
    await ve.connect(accounts[0]).approveNativeRoot();

    expect(await ve.nativeRoot()).to.equal(root);

    expect(await ve.ownerOf(1)).to.equal(ethers.ZeroAddress);
    await ve.connect(accounts[2]).claimNative(bucketId, voter, end, stakedAmount, []);
    expect(await ve.ownerOf(1)).to.equal(accounts[1].address);
    const locked = await ve.locked(1);
    expect(locked.amount).to.equal(stakedAmount);
    expect(locked.isPermanent).to.equal(false);
    expect(await ve.nativeTokenId(bucketId)).to.equal(1);
    expect(await ve.tokenIdNative(1)).to.equal(bucketId);
  });
});
