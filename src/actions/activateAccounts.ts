import { ActivateAction } from './types/index';
import { updateMinion } from './../minions/minions';
import { getProvider } from '@app/blockchain/provider';
import { GAS_WAIT_TIME, MAX_GAS_PRICE, MIN_WALLET_BALANCE } from '@app/constants';
import { MinionAccount, getMinions } from '@app/minions/minions';
import { getGasPrice } from '@app/utils/getGasPrice';
import { wait } from '@app/utils/wait';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { BigNumber } from 'ethers';
import { getGasValue } from '@app/utils/getGasValue';

export const activateAccounts = async (actions: ActivateAction[]) => {
  let minions: MinionAccount[] = getMinions();

  let acc: MinionAccount | undefined;
  while ((acc = getNextAccount(minions))) {
    if (!acc) {
      break;
    }

    console.log('🔥', `Activating account: ${acc.id}`);
    const res = await activateAccount(acc, actions);

    minions = res ? res : getMinions();
  }
};

const getNextAccount = (minions: MinionAccount[]) => {
  return minions.find(m => m.done !== true);
};

const activateAccount = async (minion: MinionAccount, actions: ActivateAction[]) => {
  if (minion.done) {
    return;
  }

  const gasTooHigh = await isGasTooHigh();
  if (gasTooHigh) {
    console.log('🔥', `Gas price too high. Waiting ${GAS_WAIT_TIME / 1000}s`);
    wait(GAS_WAIT_TIME);
    return;
  }

  const updatedMinion = { ...minion };
  const signer = getSignerFromMnemonic(minion.mnemonic);
  const balanceIn = await signer.getBalance();
  checkBalance(balanceIn);

  updatedMinion.amountIn = formatEther(balanceIn);

  for (const action of actions) {
    await action(signer);
  }

  // check out eth balance
  const balanceAfterActions = await signer.getBalance();
  const { gasValue, gasPrice, gasLimit } = await getGasValue();
  const balanceOut = balanceAfterActions.sub(gasValue);
  if (balanceOut.lte(0)) {
    throw 'No balance to send to next account';
  }

  updatedMinion.amountOut = formatEther(balanceOut);
  updatedMinion.totalFee = formatEther(balanceIn.sub(balanceOut));
  updatedMinion.done = true;
  updateMinion(updatedMinion);

  const updatedMinions = getMinions();

  const recipientMinion = getNextAccount(updatedMinions);
  if (recipientMinion) {
    const tx = await signer.sendTransaction({
      to: recipientMinion.address,
      value: balanceOut,
      gasPrice,
      gasLimit
    });

    await tx.wait();
  }

  console.log('🔥 activated account data:', updatedMinion);
  console.log('🔥', `Minion: ${minion.id} done. Funds send to next account.`);

  return updatedMinions;
};

export const isGasTooHigh = async () => {
  if (!MAX_GAS_PRICE) {
    return false;
  }

  const gasPrice = await getGasPrice(getProvider());

  return gasPrice.gt(parseUnits(String(MAX_GAS_PRICE), 'gwei'));
};

export const checkBalance = (balance: BigNumber) => {
  if (balance.lt(parseEther(MIN_WALLET_BALANCE))) {
    throw 'Account balance too low. Throwing for safety reason.';
  }
};
