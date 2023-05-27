import { GAS_WAIT_TIME } from '@app/constants';
import { getMinions } from '@app/minions/minions';
import { orbiterEthToZk } from '@app/orbiterBridge/orbiterEthToZk';
import { orbiterZkToEth } from '@app/orbiterBridge/orbiterZkToEth';
import { isGasTooHigh } from '@app/utils/isGasTooHigh';
import { wait } from '@app/utils/wait';
import { MAX_GAS_PRICE_BRIDGE } from '@app/zkSync/constants';
import { depositEthToL2 } from '@app/zkSync/depositEthToL2';

import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

export async function testOrbiter() {
  const minions = getMinions();
  const minion = minions[7];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);

  // await orbiterEthToZk(wallet, '0.1');
  await orbiterZkToEth(wallet);
}
