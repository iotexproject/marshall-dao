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

  describe('native bucket', function () {
    let root: string;
    let node1: string;
    let node2: string;

    before(function () {
      now = Math.floor(new Date().getTime() / 1000);

      node1 = ethers.keccak256(
        ethers.solidityPacked(
          ['uint256', 'address', 'uint256', 'uint256'],
          [200, accounts[1].address, now + YEAR, ethers.parseEther('100')],
        ),
      );

      node2 = ethers.keccak256(
        ethers.solidityPacked(
          ['uint256', 'address', 'uint256', 'uint256'],
          [201, accounts[2].address, now + WEEK * 2, ethers.parseEther('2000')],
        ),
      );

      root = ethers.keccak256(
        Buffer.concat(
          [Buffer.from(node1.substring(2), 'hex'), Buffer.from(node2.substring(2), 'hex')].sort(Buffer.compare),
        ),
      );
    });

    it('create native ve', async function () {
      await expect(ve.connect(accounts[1]).commitNativeRoot(root)).to.be.revertedWithCustomError(ve, 'NotTeam');
      await ve.connect(accounts[0]).commitNativeRoot(root);
      await ve.connect(accounts[0]).approveNativeRoot();

      expect(await ve.nativeRoot()).to.equal(root);

      expect(await ve.ownerOf(1)).to.equal(ethers.ZeroAddress);

      await ve
        .connect(accounts[2])
        .claimNative(200, accounts[1].address, now + YEAR, ethers.parseEther('100'), [node2]);
      expect(await ve.ownerOf(1)).to.equal(accounts[1].address);
      let locked = await ve.locked(1);
      expect(locked.amount).to.equal(ethers.parseEther('100'));
      expect(locked.isPermanent).to.equal(false);
      expect(await ve.nativeTokenId(200)).to.equal(1);
      expect(await ve.tokenIdNative(1)).to.equal(200);

      const end = locked.end;
      expect(await ve.balanceOf(accounts[1].address)).to.equal(1);
      await ve
        .connect(accounts[2])
        .claimNative(200, accounts[1].address, now + YEAR, ethers.parseEther('100'), [node2]);
      expect(await ve.balanceOf(accounts[1].address)).to.equal(1);
      locked = await ve.locked(1);
      expect(locked.amount).to.equal(ethers.parseEther('100'));
      expect(locked.isPermanent).to.equal(false);
      expect(locked.end).to.equal(end);
      expect(await ve.nativeTokenId(200)).to.equal(1);
      expect(await ve.tokenIdNative(1)).to.equal(200);
    });
  });
});
