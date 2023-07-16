import { getNextAccount, updateMinion } from '@app/minions/minions';
import { GAS_WAIT_TIME, MIN_WALLET_BALANCE } from '@app/constants';
import { MinionAccount, getMinions } from '@app/minions/minions';

import { wait } from '@app/utils/wait';
import { formatEther, parseEther } from 'ethers/lib/utils';

import { BigNumber } from 'ethers';
import { isGasTooHigh } from '@app/utils/isGasTooHigh';
import { MAX_GAS_PRICE_BRIDGE } from '@app/zkSync/constants';
import { ActivateAction, PostAction } from '@app/process/types';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';

type Config = {
  skipPostAction?: boolean;
  postAction?: PostAction;
  L2ToL2Action?: boolean;
  skipBalanceCheck?: boolean;
  skipGasCheck?: boolean;
};

export const activateAccounts = async (actions: ActivateAction[], config: Config = {}) => {
  let minions: MinionAccount[] = getMinions();

  let minion: MinionAccount | undefined;
  while ((minion = getNextAccount(minions))) {
    if (!minion) {
      break;
    }

    console.log('🚀', `Activating account: ${minion.id}`);
    const recipient = getNextAccount(minions, true);
    const res = await activateAccount({ minion, actions, recipient, config });
    await wait(5000);

    minions = res ? res : getMinions();
  }
};

const activateAccount = async ({
  minion,
  actions,
  recipient,
  config
}: {
  minion: MinionAccount;
  actions: ActivateAction[];
  recipient?: MinionAccount;
  config: Config;
}) => {
  if (minion.done) {
    return;
  }
  const { skipGasCheck, skipBalanceCheck } = config;
  const updatedMinion = { ...minion };
  const signer = getSignerFromMnemonic(minion.mnemonic);

  if (!skipGasCheck) {
    const gasTooHigh = await isGasTooHigh(signer.provider, MAX_GAS_PRICE_BRIDGE);

    if (gasTooHigh) {
      console.log('🔥', `Gas price too high. Waiting ${GAS_WAIT_TIME / 1000}s`);
      await wait(GAS_WAIT_TIME);
      return;
    }
  }

  const balanceIn = await signer.getBalance();

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
