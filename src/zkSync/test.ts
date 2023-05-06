import { GAS_WAIT_TIME } from '@app/constants';
import { getMinions } from '@app/minions/minions';
import { isGasTooHigh } from '@app/utils/isGasTooHigh';
import { wait } from '@app/utils/wait';
import { MAX_GAS_PRICE_BRIDGE } from '@app/zkSync/constants';
import { depositEthToL2 } from '@app/zkSync/depositEthToL2';

import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

export async function test() {
  const minions = getMinions();
  const minion = minions[0];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);
  if (!wallet.providerL1) {
    return;
  }

  if (await isGasTooHigh(wallet.providerL1, MAX_GAS_PRICE_BRIDGE)) {
    console.log('🔥', `Gas price too high. Waiting ${GAS_WAIT_TIME / 1000}s`);
    await wait(GAS_WAIT_TIME);
    return;
  }

  await depositEthToL2(wallet);
}
