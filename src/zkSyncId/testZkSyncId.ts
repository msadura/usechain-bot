import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { getMinions } from '@app/minions/minions';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';
import { registerRandomZkIdDomain } from '@app/zkSyncId/registerRandomZkIdDomain';

export async function testZkSyncId() {
  const minions = getMinions();
  const wallet = getZkSyncSignerFromMnemonic(minions[1].mnemonic);

  await setupMMFistAccount({ seed: minions[1].mnemonic, chain: 'ZKSYNC' });
  await registerRandomZkIdDomain({ wallet: wallet });
}
