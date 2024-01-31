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
    const balanceLogic = await ethers.deployContract('BalanceLogicLibrary');
    const delegationLogic = await ethers.deployContract('DelegationLogicLibrary');
    ve = await ethers.deployContract('VotingEscrow', [], {
      signer: accounts[0],
      libraries: {
        BalanceLogicLibrary: balanceLogic.target,
        DelegationLogicLibrary: delegationLogic.target,
      },
    });
    await ve.initialize([]);
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
      await expect(ve.connect(accounts[1]).commitNativeRoots([root])).to.be.revertedWithCustomError(ve, 'NotTeam');
      await ve.connect(accounts[0]).commitNativeRoots([root]);
      await ve.connect(accounts[0]).approveNativeRoots();

      expect(await ve.nativeRoot(0)).to.equal(root);

      expect(await ve.ownerOf(1)).to.equal(ethers.ZeroAddress);

      await ve
        .connect(accounts[2])
        .claimNative(200, accounts[1].address, now + YEAR, ethers.parseEther('100'), root, [node2]);
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
        .claimNative(200, accounts[1].address, now + YEAR, ethers.parseEther('100'), root, [node2]);
      expect(await ve.balanceOf(accounts[1].address)).to.equal(1);
      locked = await ve.locked(1);
      expect(locked.amount).to.equal(ethers.parseEther('100'));
      expect(locked.isPermanent).to.equal(false);
      expect(locked.end).to.equal(end);
      expect(await ve.nativeTokenId(200)).to.equal(1);
      expect(await ve.tokenIdNative(1)).to.equal(200);
    });

    it('new roots', async function () {
      expect(await ve.nativeRootsLength()).to.equal(1);
      expect(await ve.pendingNativeRootsLength()).to.equal(1);
      await ve
        .connect(accounts[0])
        .commitNativeRoots([
          '0xbd9f4afe55a5d8d2a8e6877c836619210f7e4cad731a462d21ed21810cf95f69',
          '0x87a28a9921aec2784a49cd425412717a5d0138966baa1087c305429e7cd4fd20',
        ]);
      expect(await ve.nativeRootsLength()).to.equal(1);
      expect(await ve.pendingNativeRootsLength()).to.equal(2);
      await ve.connect(accounts[0]).approveNativeRoots();
      expect(await ve.nativeRootsLength()).to.equal(2);

      await expect(
        ve
          .connect(accounts[2])
          .claimNative(200, accounts[1].address, now + YEAR, ethers.parseEther('100'), root, [node2]),
      ).to.be.revertedWithCustomError(ve, 'InvalidRoot');

      expect(await ve.balanceOf('0x2c315181b9d4e46e5491a0517c07de349c3bd487')).to.equal(0);
      await ve
        .connect(accounts[2])
        .claimNative(
          58883,
          '0x2c315181b9d4e46e5491a0517c07de349c3bd487',
          1709212657,
          96875147383225985091955n,
          '0x87a28a9921aec2784a49cd425412717a5d0138966baa1087c305429e7cd4fd20',
          [
            '0x7b500757c8b0eb5573f024910c4ce12c56063667659a53b2a2643a043cb1961d',
            '0x603e4df20b56d1e8ab66710781f3982af5361404a8f1e4543633d519d7987f28',
            '0xad4e7eaeac44bf7d5cba82f2e8043b63a8d6cc033cc1a0f0696252afe31c25b6',
            '0xd1c2c10b069f463c2e8253d0346420d96d2150932bf9fc9104c73da75c2b5ebd',
            '0x10f45744b8423776535a226d12c87784e3f54525e82ba7dd4da7f37565c2a1c4',
            '0x88a332194125fd4214e4a53b4a258c1db7f697e6093e7e266db7ce3fd105beea',
            '0x7df342affe4c93328e9f8ce390ae9e86b22f30632405e3310b6672078fb3e538',
            '0xdf4a7d87273b691644c2a4171912199adb90460358eceff9fa7db65ad512f5b9',
            '0xdede6b2ed735996d3ac262b897974ca56eedda33597601ce939a9d630b1bc75d',
            '0x393a17291b56b3131740d0d0439f0c47eb78085a6746fcc9506dc9d57e91a775',
            '0x10045be4c6337509ee805ec6ca69962a1a95d4c29bd91da2cc609237da12908e',
            '0x88ead5b46e066d4afaa2ba8d5f5d67af17e0e21231504b4acfcee80b18b33956',
            '0x7d495f9d4bf40bed8c552fab70a22be7dde892ff53ee675beffb1b4feabe0902',
            '0xebb323c0d369e0fdf5bf8bc5672c4452980480d0af4f1edd20ce09848a68bcbb',
          ],
        );
      expect(await ve.balanceOf('0x2c315181b9d4e46e5491a0517c07de349c3bd487')).to.equal(1);

      expect(await ve.balanceOf('0x274880f6a49e272d014a38a6cbf70745f78be97c')).to.equal(0);
      await ve
        .connect(accounts[2])
        .claimNative(
          10,
          '0x274880f6a49e272d014a38a6cbf70745f78be97c',
          1734282935,
          1319048074701238343513203n,
          '0xbd9f4afe55a5d8d2a8e6877c836619210f7e4cad731a462d21ed21810cf95f69',
          [
            '0x3a5040f68f45376d4de453b6815292e85b6fecba60508d8c98bd45819ff4102d',
            '0xf2252ba65ef362b77657ff6d1c58c4df47e7bf9dd379ad96816865c2f9676966',
            '0x22bdc23013d31bc249d4ec1e7f9c4c48f80c6ea2c86192f9ac4fb0640b889e78',
            '0x91f961379e0fba07087297cd7dc94e62854d1c111dd4daff7ab7d923ead028b0',
            '0xba1aecf645deee3b9cf6beed5d88354b798b6082946a6c685473580d178f95fb',
            '0xa6999e6a9a1dbbf6e7524bba62df2a954c89347acbda509e5c90f25cfeb0f33a',
            '0xcbea1e50b336f87f16b30c67e1c926ef3133b6760928027cfa396af90864e448',
            '0xf4460d3bc61da56a24cf6270a34b3fc36acce8d1f29b2817f51b101818aa053b',
            '0x788bbba70ef1e587c1e5802dac2cdfb4ec109f1a59ca1664d1961c224d4b0c6c',
            '0x06f58c7757dd54c66528702949d916849b42091c123e03360d95772ffc5641ab',
            '0x12e2c08b4558747741a848de74d721a07a956f1ef679eb843af9f502a915eaaf',
            '0xc36933d70ddbdcb02da5786310fd0a1a885cc4cfdd1febad646ea17830ec9792',
            '0xf892a5f55c6d3d8a0aba9c34315150565d91201a389d57bc683c55f4f182c2b2',
            '0x482943ca78ac725dbbbde5cce17f95aaddcdefeb98c6daf607b847820cd88449',
          ],
        );
      expect(await ve.balanceOf('0x274880f6a49e272d014a38a6cbf70745f78be97c')).to.equal(1);

      await ve
        .connect(accounts[2])
        .claimNative(
          0,
          '0xc2b1dc4d5adf5ce43d813282b9e508d3de0a583b',
          1714483057,
          2138109339745468104220672n,
          '0xbd9f4afe55a5d8d2a8e6877c836619210f7e4cad731a462d21ed21810cf95f69',
          [
            '0x92ed514fa3cc423d25128eb2b78df61fa7b18d0aa446990ec315062decf9e38c',
            '0x4174b5dbed567380a7ad9e497ae6e3f09461605c2a4ae743adc0c0c9f2bcec9d',
            '0x2abc507ff435012cd3e0effff5f12df340865155376bfe227ad3a8ecab23ca37',
            '0x91f961379e0fba07087297cd7dc94e62854d1c111dd4daff7ab7d923ead028b0',
            '0xba1aecf645deee3b9cf6beed5d88354b798b6082946a6c685473580d178f95fb',
            '0xa6999e6a9a1dbbf6e7524bba62df2a954c89347acbda509e5c90f25cfeb0f33a',
            '0xcbea1e50b336f87f16b30c67e1c926ef3133b6760928027cfa396af90864e448',
            '0xf4460d3bc61da56a24cf6270a34b3fc36acce8d1f29b2817f51b101818aa053b',
            '0x788bbba70ef1e587c1e5802dac2cdfb4ec109f1a59ca1664d1961c224d4b0c6c',
            '0x06f58c7757dd54c66528702949d916849b42091c123e03360d95772ffc5641ab',
            '0x12e2c08b4558747741a848de74d721a07a956f1ef679eb843af9f502a915eaaf',
            '0xc36933d70ddbdcb02da5786310fd0a1a885cc4cfdd1febad646ea17830ec9792',
            '0xf892a5f55c6d3d8a0aba9c34315150565d91201a389d57bc683c55f4f182c2b2',
            '0x482943ca78ac725dbbbde5cce17f95aaddcdefeb98c6daf607b847820cd88449',
          ],
        );
      expect(await ve.balanceOf('0xc2b1dc4d5adf5ce43d813282b9e508d3de0a583b')).to.equal(1);
      const tokenId = await ve.nativeTokenId(0);
      expect(await ve.tokenIdNative(tokenId)).to.equal(0);
    });
  });
});
