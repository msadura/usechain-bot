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
  await depositEthToL2(wallet);
  await wait(5000);

  // bridge back to L1
  await orbiterZkToEth(wallet);

  return true;
};

const postZkBridgeAction: PostZkAction = async ({ wallet, recipient, minion, minionsFilename }) => {
  // move funds on L1 account

  // updateMinion(updatedMinion, minionsFilename);
  const updatedMinions = getMinions(minionsFilename);
  const updatedMinion = updatedMinions[minion.id];
  const balanceIn = parseEther(minion.amountIn || '0');

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
  updateMinion(updatedMinion);
};

export const activateZkBridgeAccounts = async () => {
  await activateZkAccounts([bridgeZkAction], {
    skipPostAction: true,
    postAction: postZkBridgeAction
  });
};
