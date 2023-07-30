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
import { orbiterZkToOp, waitForOpFunds } from '@app/orbiterBridge/orbiterZkToOp';
import { depositFundsFromMinion } from '@app/bitget/depositFundsFromMinion';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';

const MIN_ACCOUNT_BALANCE = '0.011';

const bridgeWithBitgetActtion: ActivateZkAction = async ({ wallet, minion }) => {
  resetCacheOnAccountChange(wallet.address);

  if (!getCachedActions(wallet.address).feedFromBitget) {
    // feed account from bitget
    await withdrawETH({ recipient: wallet.address });
    const ethWallet = getSignerFromMnemonic(minion.mnemonic);
    await waitForBalanceUpdate({ wallet: ethWallet, retryInterval: 30000 });

    setCachedActions(wallet.address, { feedFromBitget: true });
    await wait(5000);
  }

  if (!getCachedActions(wallet.address).depositToL2) {
    // bridge from eth to zk
    const balance = await wallet.getBalanceL1();
    const depositBalance = balance.sub(parseEther(MIN_ACCOUNT_BALANCE));
    console.log('🔥 bridge amount:', depositBalance);
    await depositEthToL2(wallet, formatEther(depositBalance));
    setCachedActions(wallet.address, { depositToL2: true });

    await wait(5000);
  }

  // bridge to OP to be able to deposit back to bitget
  if (!getCachedActions(wallet.address).bridgeZkToOP) {
    await orbiterZkToOp({ wallet });
    setCachedActions(wallet.address, { bridgeZkToOP: true });
  }

  if (!getCachedActions(wallet.address).opFundsReceived) {
    const opWallet = getSignerFromMnemonic(minion.mnemonic, 10);
    await waitForOpFunds(opWallet);
    setCachedActions(wallet.address, { opFundsReceived: true });
  }

  // send OP funds to bitget
  if (!getCachedActions(wallet.address).sendOpToBitget) {
    await depositFundsFromMinion({ minion, chain: 10 });
    setCachedActions(wallet.address, { sendOpToBitget: true });
  }

  return true;
};

const postZkBridgeAction: PostZkAction = async ({ minion }) => {
  // move funds on L1 account
  console.log('🔥', 'POST ACTION...');
  const updatedMinions = getMinions();
  const updatedMinion = updatedMinions[minion.id];

  updatedMinion.done = true;
  updateMinion(updatedMinion);

  resetCache();

  console.log('✅', `Minion: ${minion.id} done. Funds send to bitget. ✅`);
};

export const bridgeZkWithBitget = async () => {
  await activateZkAccounts([bridgeWithBitgetActtion], {
    skipPostAction: true,
    skipBalanceCheck: true,
    postAction: postZkBridgeAction
  });
};
