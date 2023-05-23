import { getNextAccount, updateMinion } from '@app/minions/minions';
import { GAS_WAIT_TIME, MIN_WALLET_BALANCE } from '@app/constants';
import { MinionAccount, getMinions } from '@app/minions/minions';

import { wait } from '@app/utils/wait';
import { formatEther, parseEther } from 'ethers/lib/utils';

import { BigNumber } from 'ethers';
import { isGasTooHigh } from '@app/utils/isGasTooHigh';
import { ActivateZkAction, PostZkAction } from '@app/zkSync/types';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';
import { MAX_GAS_PRICE_BRIDGE } from '@app/zkSync/constants';

type Config = {
  skipPostAction?: boolean;
  postAction?: PostZkAction;
};

const minionsFilename = 'zkMinions';

export const activateZkAccounts = async (actions: ActivateZkAction[], config: Config = {}) => {
  let minions: MinionAccount[] = getMinions(minionsFilename);

  let acc: MinionAccount | undefined;
  while ((acc = getNextAccount(minions))) {
    if (!acc) {
      break;
    }

    console.log('🔥', `Activating account: ${acc.id}`);
    const recipient = getNextAccount(minions, true)?.address || '';
    const res = await activateAccount(acc, actions, recipient, config);
    await wait(5000);

    minions = res ? res : getMinions(minionsFilename);
  }
};

const activateAccount = async (
  minion: MinionAccount,
  actions: ActivateZkAction[],
  recipient: string,
  config: Config
) => {
  if (minion.done) {
    return;
  }

  const updatedMinion = { ...minion };
  const signer = getZkSyncSignerFromMnemonic(minion.mnemonic);

  if (!signer.providerL1) {
    throw new Error('No provider for L1');
  }

  const gasTooHigh = await isGasTooHigh(signer.providerL1, MAX_GAS_PRICE_BRIDGE);
  if (gasTooHigh) {
    console.log('🔥', `Gas price too high. Waiting ${GAS_WAIT_TIME / 1000}s`);
    await wait(GAS_WAIT_TIME);
    return;
  }

  const balanceIn = await signer.getBalance();
  checkBalance(balanceIn);

  updatedMinion.amountIn = formatEther(balanceIn);
  updateMinion(updatedMinion, minionsFilename);

  for (const action of actions) {
    await action(signer, recipient);
    await wait(5000);
  }

  if (config.postAction) {
    // post action
    return getMinions(minionsFilename);
  }

  updatedMinion.done = true;
  updateMinion(updatedMinion, minionsFilename);
  const updatedMinions = getMinions(minionsFilename);

  // check out eth balance
  // const balanceAfterActions = await signer.getBalance();

  // if (config.skipPostAction) {
  //   return updatedMinions;
  // }

  // const recipientMinion = getNextAccount(updatedMinions);
  // let balanceOut = balanceAfterActions;
  // if (recipientMinion) {
  //   balanceOut = await transferEthFromWallet(signer, recipientMinion.address);
  // }

  // updatedMinion.amountOut = formatEther(balanceOut);
  // updatedMinion.totalFee = formatEther(balanceIn.sub(balanceOut));
  // updatedMinion.done = true;
  // updateMinion(updatedMinion);

  console.log('🔥 activated account fee:', updatedMinion.totalFee);
  console.log('✅', `Minion: ${minion.id} done. Funds send to next account. ✅`);

  return updatedMinions;
};

export const checkBalance = (balance: BigNumber) => {
  console.log('🔥', formatEther(balance), MIN_WALLET_BALANCE);
  if (balance.lt(parseEther(MIN_WALLET_BALANCE))) {
    throw 'Account balance too low. Throwing for safety reason.';
  }
};
