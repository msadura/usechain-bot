import { getMinions } from '@app/minions/minions';
import { USDC_ASSET, WETH_ASSET } from '@app/zkSync/constants';
import { swap } from '@app/muteswitch/swap';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

export async function muteTest() {
  const minions = getMinions();
  const minion = minions[1];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);
  if (!wallet.providerL1) {
    return;
  }

  // await swap({ assetIn: WETH_ASSET, assetOut: USDC_ASSET, wallet });
  await swap({ assetIn: USDC_ASSET, assetOut: WETH_ASSET, wallet });
}

export async function testPostSyncSwap() {
  const minions = getMinions();
  const minion = minions[0];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);
  // await postSyncSwapAction({ wallet, recipient: minions[1], minion });
}
