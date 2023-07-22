import { getMinions } from '@app/minions/minions';
import { USDC_ASSET, WETH_ASSET } from '@app/zkSync/constants';

import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';
import { swap } from '@app/woofi/swap';

export async function woofiTest() {
  const minions = getMinions();
  const minion = minions[1];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);
  if (!wallet.providerL1) {
    return;
  }

  // await swap({ assetIn: WETH_ASSET, assetOut: USDC_ASSET, wallet });
  await swap({ assetIn: USDC_ASSET, assetOut: WETH_ASSET, wallet });
}
