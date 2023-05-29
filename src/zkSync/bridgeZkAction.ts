import { getMinions, updateMinion } from '@app/minions/minions';
import { orbiterZkToEth } from '@app/orbiterBridge/orbiterZkToEth';
import { transferEthFromWallet } from '@app/utils/transferEthFromWallet';
import { wait } from '@app/utils/wait';
import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { depositEthToL2 } from '@app/zkSync/depositEthToL2';
import { ActivateZkAction, PostZkAction } from '@app/zkSync/types';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { Wallet } from 'zksync-web3';
import {
  getCachedActions,
  setCachedActions,
  resetCache,
  resetCacheOnAccountChange
} from '@app/cache/accountCache';

const bridgeZkAction: ActivateZkAction = async (wallet: Wallet) => {
  resetCacheOnAccountChange(wallet.address);

  if (!getCachedActions(wallet.address).depositToL2) {
    // bridge from eth to zk
    const balance = wallet.getBalanceL1();
    const depositBalance = (await balance).div(100).mul(80);
    await depositEthToL2(wallet, formatEther(depositBalance));
    setCachedActions(wallet.address, { depositToL2: true });

    await wait(5000);
  }

  // bridge back to L1
  if (!getCachedActions(wallet.address).backToL1) {
    await orbiterZkToEth(wallet);
    setCachedActions(wallet.address, { backToL1: true });
  }

  return true;
};

const postZkBridgeAction: PostZkAction = async ({ wallet, recipient, minion, minionsFilename }) => {
  // move funds on L1 account
  console.log('🔥', 'POST ACTION...');
  const updatedMinions = getMinions(minionsFilename);
  const updatedMinion = updatedMinions[minion.id];
  const balanceIn = parseEther(minion.amountIn || '0');

  // check out eth balance
  const balanceAfterActions = await wallet.getBalanceL1();

  let balanceOut = balanceAfterActions;
  if (recipient) {
    // transfering l1 eth
    balanceOut = await transferEthFromWallet(wallet.ethWallet(), recipient, {
      gasLimit: 21000,
      minGasPrice: 25
    });
  }

  updatedMinion.amountOut = formatEther(balanceOut);
  updatedMinion.totalFee = formatEther(balanceIn.sub(balanceOut));
  updatedMinion.done = true;
  updateMinion(updatedMinion, minionsFilename);

  resetCache();

  console.log('✅', `Minion: ${minion.id} done. Funds send to next account. ✅`);
};

export const activateZkBridgeAccounts = async () => {
  await activateZkAccounts([bridgeZkAction], {
    skipPostAction: true,
    postAction: postZkBridgeAction
  });
};
