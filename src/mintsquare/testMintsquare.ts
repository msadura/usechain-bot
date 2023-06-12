import { getMinions } from '@app/minions/minions';
import { mint } from '@app/mintsquare/mint';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

export async function mintsquareTest() {
  const minions = getMinions();
  const minion = minions[0];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);

  await mint({ wallet });
}
