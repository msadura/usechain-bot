import { getBrowserInstance } from '@app/e2e/browserInstance';
import { importNextAccount } from '@app/e2e/utils/importNextAccount';
import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { getMinions } from '@app/minions/minions';
import { wait } from '@app/utils/wait';
import { registerRandomDomain } from '@app/zkSyncNameService/registerRandomDomain';

export async function testE2E() {
  const minions = getMinions();

  await setupMMFistAccount({ seed: minions[5].mnemonic, chain: 'ZKSYNC' });
  await wait(5000);
  const { mm } = getBrowserInstance();
  await importNextAccount({ mm, seed: minions[6].mnemonic });
  // await registerRandomDomain();
}
