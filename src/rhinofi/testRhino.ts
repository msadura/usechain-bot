import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { getMinions } from '@app/minions/minions';
import { connectWallet } from '@app/rhinofi/utils/connectWallet';

export async function testRhino() {
  const minions = getMinions();

  await setupMMFistAccount({ seed: minions[1].mnemonic /* ,chain: 'ZKSYNC'*/ });
  await connectWallet({ minion: minions[1] });
}
