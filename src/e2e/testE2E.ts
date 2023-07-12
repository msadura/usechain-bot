import { getMinions } from '@app/minions/minions';
import { wait } from '@app/utils/wait';
import { registerRandomDomain } from '@app/zkSyncNameService/registerRandomDomain';

export async function testE2E() {
  const minions = getMinions();

  // await setupMMFistAccount({ seed: minions[0].mnemonic, chain: 'ZKSYNC' });
  await registerRandomDomain({ minion: minions[5] });
  await wait(30000);
}
