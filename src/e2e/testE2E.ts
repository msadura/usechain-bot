import { getBrowserInstance } from '@app/e2e/browserInstance';
import { ethToGoerli } from '@app/e2e/testnetBridge/ethToGoerli';
import { importNextAccount } from '@app/e2e/utils/importNextAccount';
import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { getMinions } from '@app/minions/minions';
import { wait } from '@app/utils/wait';
import { registerRandomDomain } from '@app/zkSyncNameService/registerRandomDomain';

export async function testE2E() {
  const minions = getMinions();

  await setupMMFistAccount({ seed: minions[0].mnemonic });
  await wait(5000);
  const { mm } = getBrowserInstance();
  await ethToGoerli({ minion: minions[0], amountIn: '0.0005' });
}
