import { getMinions, updateMinion } from '@app/minions/minions';
import { transferEthFromWallet } from '@app/utils/transferEthFromWallet';
import { wait } from '@app/utils/wait';
import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { depositEthToL2 } from '@app/zkSync/depositEthToL2';
import { ActivateZkAction, PostZkAction } from '@app/zkSync/types';
import { formatEther, parseEther } from 'ethers/lib/utils';
import {
  getCachedActions,
  setCachedActions,
  resetCache,
  resetCacheOnAccountChange
} from '@app/cache/accountCache';
import { withdrawETH } from '@app/bitget/withdrawETH';
import { waitForBalanceUpdate } from '@app/utils/waitForBalanceUpdate';
import { orbiterZkToOp } from '@app/orbiterBridge/orbiterZkToOp';
import { depositFundsFromMinion } from '@app/bitget/depositFundsFromMinion';

const bridgeWithBitgetActtion: ActivateZkAction = async ({ wallet, minion }) => {
  resetCacheOnAccountChange(wallet.address);

  if (!getCachedActions(wallet.address).feedFromBitget) {
    // feed account from bitget
    await withdrawETH({ recipient: wallet.address });
    await waitForBalanceUpdate({ wallet, retryInterval: 30000 });

    setCachedActions(wallet.address, { feedFromBitget: true });
    await wait(5000);
  }

  if (!getCachedActions(wallet.address).depositToL2) {
    // bridge from eth to zk
    const balance = wallet.getBalanceL1();
    const depositBalance = (await balance).div(100).mul(90);
    await depositEthToL2(wallet, formatEther(depositBalance));
    setCachedActions(wallet.address, { depositToL2: true });

    await wait(5000);
  }

  // bridge to OP to be able to deposit back to bitget
  if (!getCachedActions(wallet.address).bridgeZkToOP) {
    await orbiterZkToOp(wallet);
    setCachedActions(wallet.address, { bridgeZkToOP: true });
  }

  // send OP funcds to bitget
  if (!getCachedActions(wallet.address).sendOpToBitget) {
    await depositFundsFromMinion({ minion, chain: 'op' });
    setCachedActions(wallet.address, { sendOpToBitget: true });
  }

  return true;
};

const postZkBridgeAction: PostZkAction = async ({ wallet, recipient, minion }) => {
  // move funds on L1 account
  console.log('🔥', 'POST ACTION...');
  const updatedMinions = getMinions();
  const updatedMinion = updatedMinions[minion.id];
  const balanceIn = parseEther(minion.amountIn || '0');

  // check out eth balance
  const balanceAfterActions = await wallet.getBalanceL1();

  let balanceOut = balanceAfterActions;
  if (recipient) {
    // transfering l1 eth
    balanceOut = await transferEthFromWallet(wallet.ethWallet(), recipient.address, {
      gasLimit: 21000,
      minGasPrice: 25
    });
  }

  updatedMinion.amountOut = formatEther(balanceOut);
  updatedMinion.totalFee = formatEther(balanceIn.sub(balanceOut));
  updatedMinion.done = true;
  updateMinion(updatedMinion);

  resetCache();

  console.log('✅', `Minion: ${minion.id} done. Funds send to next account. ✅`);
};

export const bridgeZkWithBitget = async () => {
  await activateZkAccounts([bridgeWithBitgetActtion], {
    skipPostAction: true,
    skipBalanceCheck: true,
    postAction: postZkBridgeAction
  });
};
