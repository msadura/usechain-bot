import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { getMinions } from '@app/minions/minions';
import { registerAccount } from '@app/rhinofi/utils/registerAccount';

export async function testRhino() {
  const minions = getMinions();

  await setupMMFistAccount({ seed: minions[0].mnemonic /* ,chain: 'ZKSYNC'*/ });
  await registerAccount({ minion: minions[0] });
}
