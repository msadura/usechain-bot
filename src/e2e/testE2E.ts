import { registerRandomDomain } from '@app/e2e/zknsDomains/registerRandomDomain';
import { getMinions } from '@app/minions/minions';
import { wait } from '@app/utils/wait';

export async function testE2E() {
  const minions = getMinions();

  // await setupMMFistAccount({ seed: minions[0].mnemonic, chain: 'ZKSYNC' });
  await registerRandomDomain({ minion: minions[5] });
  await wait(30000);
}
