import '@app/init';
import { getMinions } from '@app/minions/minions';

import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

import { ethers } from 'ethers';

const nftAddress = '0xD07180c423F9B8CF84012aA28cC174F3c433EE29';

export async function action() {
  const minions = getMinions();

  for (const minion of minions) {
    const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);

    const contract = new ethers.Contract(
      nftAddress,
      ['function balanceOf(address owner) external view returns (uint256 balance)'],
      wallet
    );

    const balance = await contract.balanceOf(minion.address);
    console.log(`🔥bal: ${minion.id}`, balance.toString());
  }
}

action();
