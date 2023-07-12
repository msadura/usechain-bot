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
  L2ToL2Action?: boolean;
  skipBalanceCheck?: boolean;
};

export const activateZkAccounts = async (actions: ActivateZkAction[], config: Config = {}) => {
  let minions: MinionAccount[] = getMinions();

  let acc: MinionAccount | undefined;
  while ((acc = getNextAccount(minions))) {
    if (!acc) {
      break;
    }

    console.log('🚀', `Activating account: ${acc.id}`);
    const recipient = getNextAccount(minions, true)?.address || '';
    const res = await activateAccount(acc, actions, recipient, config);
    await wait(5000);

    minions = res ? res : getMinions();
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
  const { L2ToL2Action, skipBalanceCheck } = config;
  const updatedMinion = { ...minion };
  const signer = getZkSyncSignerFromMnemonic(minion.mnemonic);

  if (!signer.providerL1) {
    throw new Error('No provider for L1');
  }

  const provider = L2ToL2Action ? signer.provider : signer.providerL1;
  const gasTooHigh = await isGasTooHigh(provider, MAX_GAS_PRICE_BRIDGE);

  if (gasTooHigh) {
    console.log('🔥', `Gas price too high. Waiting ${GAS_WAIT_TIME / 1000}s`);
    await wait(GAS_WAIT_TIME);
    return;
  }

  const balancePromise = L2ToL2Action ? signer.getBalance() : signer.getBalanceL1();
  const balanceIn = await balancePromise;

  if (!skipBalanceCheck) {
    checkBalance(balanceIn);
  }

  updatedMinion.amountIn = formatEther(balanceIn);
  updateMinion(updatedMinion);

  for (const action of actions) {
    await action({ wallet: signer, recipient, minion });
    await wait(5000);
  }

  if (config.postAction) {
    await config.postAction({ wallet: signer, recipient, minion });
    return getMinions();
  }

  updatedMinion.done = true;
  updateMinion(updatedMinion);
  const updatedMinions = getMinions();

  console.log('🔥 activated account fee:', updatedMinion.totalFee);
  console.log('✅', `Minion: ${minion.id} done. Funds send to next account. ✅`);

  return updatedMinions;
};

export const checkBalance = (balance: BigNumber) => {
  console.log('🔥balance (current / min)', formatEther(balance), MIN_WALLET_BALANCE);
  if (balance.lt(parseEther(MIN_WALLET_BALANCE))) {
    throw 'Account balance too low. Throwing for safety reason.';
  }
};
