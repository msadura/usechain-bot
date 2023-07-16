import { getBrowserInstance } from '@app/e2e/browserInstance';
import { importNextAccount } from '@app/e2e/utils/importNextAccount';
import { MinionAccount } from '@app/minions/minions';
import { connectWallet } from '@app/rhinofi/utils/connectWallet';
import { wait } from '@app/utils/wait';

export async function registerAccount({ minion }: { minion: MinionAccount }) {
  const { mm } = getBrowserInstance();

  await importNextAccount({ mm, seed: minion.mnemonic });
  await wait(1000);
  await connectWallet();
}
