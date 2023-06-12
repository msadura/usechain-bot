import { getMinions } from '@app/minions/minions';
import { USDC_ASSET, WETH_ASSET } from '@app/syncswap/constants';
import { swap } from '@app/syncswap/swap';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

export async function testSyncSwap() {
  const minions = getMinions();
  const minion = minions[0];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);
  if (!wallet.providerL1) {
    return;
  }

  await swap({ assetIn: WETH_ASSET, assetOut: USDC_ASSET, wallet });
}
