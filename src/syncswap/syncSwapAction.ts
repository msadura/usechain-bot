import { getMinions, updateMinion } from '@app/minions/minions';
import { wait } from '@app/utils/wait';
import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { ActivateZkAction, PostZkAction } from '@app/zkSync/types';
import { formatEther, parseEther } from 'ethers/lib/utils';
import {
  getCachedActions,
  setCachedActions,
  resetCache,
  resetCacheOnAccountChange
} from '@app/cache/accountCache';
import { USDC_ASSET, WETH_ASSET } from '@app/syncswap/constants';
import { swap } from '@app/syncswap/swap';
import { transferZkEth } from '@app/zkSync/transferZkEth';
import { BigNumber } from 'ethers';

const KEEP_ACCOUNT_BALANCE = '0.006';

const syncSwapAction: ActivateZkAction = async ({ wallet }) => {
  resetCacheOnAccountChange(wallet.address);

  if (!getCachedActions(wallet.address).swapToUSDC) {
    // swap ETH -> USDC
    await swap({ assetIn: WETH_ASSET, assetOut: USDC_ASSET, wallet });
    setCachedActions(wallet.address, { swapToUSDC: true });

    await wait(5000);
  }

  if (!getCachedActions(wallet.address).swapToETH) {
    // swap USDC -> ETH
    await swap({ assetIn: USDC_ASSET, assetOut: WETH_ASSET, wallet });
    setCachedActions(wallet.address, { swapToETH: true });

    await wait(5000);
  }

  return true;
};

export const postSyncSwapAction: PostZkAction = async ({ wallet, recipient, minion }) => {
  // move funds on L1 account
  console.log('ℹ️', 'POST SYNC SWAP ACTION...');

  const updatedMinions = getMinions();
  const updatedMinion = updatedMinions[minion.id];
  const balanceIn = parseEther(minion.amountIn || '0');

  let balanceOut: BigNumber | undefined;

  if (recipient) {
    // check out eth L2 balance
    console.log('ℹ️', 'Transfer L2 ETH to next account...');
    balanceOut = await transferZkEth({
      wallet,
      recipient: recipient.address,
      minAccountBalance: KEEP_ACCOUNT_BALANCE
    });
  }

  if (!balanceOut) {
    balanceOut = await wallet.getBalance();
  }

  updatedMinion.amountOut = formatEther(balanceOut);
  updatedMinion.totalFee = formatEther(balanceIn.sub(balanceOut));
  updatedMinion.done = true;
  updateMinion(updatedMinion);

  resetCache();

  console.log('✅', `Minion: ${minion.id} done. Funds send to next account. ✅`);
};

export const activateSyncSwapAccounts = async () => {
  await activateZkAccounts([syncSwapAction], {
    skipPostAction: true,
    postAction: postSyncSwapAction,
    L2ToL2Action: true
  });
};
