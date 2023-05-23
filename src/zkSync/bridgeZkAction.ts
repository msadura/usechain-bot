import { getMinions, updateMinion } from '@app/minions/minions';
import { orbiterZkToEth } from '@app/orbiterBridge/orbiterZkToEth';
import { transferEthFromWallet } from '@app/utils/transferEthFromWallet';
import { wait } from '@app/utils/wait';
import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { depositEthToL2 } from '@app/zkSync/depositEthToL2';
import { ActivateZkAction, PostZkAction } from '@app/zkSync/types';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { Wallet } from 'zksync-web3';

const bridgeZkAction: ActivateZkAction = async (wallet: Wallet) => {
  // bridge from eth to zk
  const balance = wallet.getBalanceL1();
  const depositBalance = (await balance).div(100).mul(80);
  await depositEthToL2(wallet, formatEther(depositBalance));
  await wait(5000);

  // bridge back to L1
  await orbiterZkToEth(wallet);

  return true;
};

const postZkBridgeAction: PostZkAction = async ({ wallet, recipient, minion, minionsFilename }) => {
  // move funds on L1 account
  console.log('🔥', 'POST ACTION...');
  const updatedMinions = getMinions(minionsFilename);
  const updatedMinion = updatedMinions[minion.id];
  const balanceIn = parseEther(minion.amountIn || '0');

  updatedMinion.done = true;
  updateMinion(updatedMinion, minionsFilename);

  // check out eth balance
  const balanceAfterActions = await wallet.getBalanceL1();

  let balanceOut = balanceAfterActions;
  if (recipient) {
    // transfering l1 eth
    balanceOut = await transferEthFromWallet(wallet.ethWallet(), recipient, 21000);
  }

  updatedMinion.amountOut = formatEther(balanceOut);
  updatedMinion.totalFee = formatEther(balanceIn.sub(balanceOut));
  updatedMinion.done = true;
  updateMinion(updatedMinion, minionsFilename);

  console.log('🔥 activated account fee:', updatedMinion.totalFee);
  console.log('✅', `Minion: ${minion.id} done. Funds send to next account. ✅`);
};

export const activateZkBridgeAccounts = async () => {
  await activateZkAccounts([bridgeZkAction], {
    skipPostAction: true,
    postAction: postZkBridgeAction
  });
};
