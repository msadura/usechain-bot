import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { getMinions } from '@app/minions/minions';
import { wait } from '@app/utils/wait';

export async function testE2E() {
  const minions = getMinions();

  await setupMMFistAccount({ seed: minions[0].mnemonic, chain: 'ZKSYNC' });
  await wait(30000);
}
