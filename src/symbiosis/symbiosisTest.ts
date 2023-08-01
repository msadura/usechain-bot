import { getMinions } from '@app/minions/minions';
import { USDC_ASSET, WETH_ASSET } from '@app/zkSync/constants';

import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';
import { swap } from '@app/symbiosis/swap';
import { ethers } from 'ethers';

export async function symbiosisTest() {
  const minions = getMinions();
  const minion = minions[1];

  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);
  if (!wallet.providerL1) {
    return;
  }

  await swap({ assetIn: USDC_ASSET, assetOut: WETH_ASSET, wallet, chainIn: 324, chainOut: 10 });
  // await swap({ assetIn: USDC_ASSET, assetOut: WETH_ASSET, wallet });
}
