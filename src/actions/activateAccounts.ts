import { transferEthFromWallet } from '@app/utils/transferEthFromWallet';
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

type Config = {
  skipPostAction?: boolean;
};

export const activateAccounts = async (actions: ActivateAction[], config: Config = {}) => {
  let minions: MinionAccount[] = getMinions();

  let acc: MinionAccount | undefined;
  while ((acc = getNextAccount(minions))) {
    if (!acc) {
      break;
    }

    console.log('🔥', `Activating account: ${acc.id}`);
    const recipient = getNextAccount(minions, true)?.address || '';
    const res = await activateAccount(acc, actions, recipient, config);
    await wait(5000);

    minions = res ? res : getMinions();
  }
};

const getNextAccount = (minions: MinionAccount[], getRecipient = false) => {
  const idx = minions.findIndex(m => m.done !== true);
  if (idx < 0) {
    return;
  }

  const minionIndex = getRecipient ? idx + 1 : idx;
  const minion = minions[minionIndex];

  return minion;
};

const activateAccount = async (
  minion: MinionAccount,
  actions: ActivateAction[],
  recipient: string,
  config: Config
) => {
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
    await action(signer, recipient);
    await wait(5000);
  }

  updatedMinion.done = true;
  updateMinion(updatedMinion);

  // check out eth balance
  const balanceAfterActions = await signer.getBalance();
  const updatedMinions = getMinions();

  if (config.skipPostAction) {
    return updatedMinions;
  }

  const recipientMinion = getNextAccount(updatedMinions);
  let balanceOut = balanceAfterActions;
  if (recipientMinion) {
    balanceOut = await transferEthFromWallet(signer, recipientMinion.address);
  }

  updatedMinion.amountOut = formatEther(balanceOut);
  updatedMinion.totalFee = formatEther(balanceIn.sub(balanceOut));
  updatedMinion.done = true;
  updateMinion(updatedMinion);

  console.log('🔥 activated account fee:', updatedMinion.totalFee);
  console.log('✅', `Minion: ${minion.id} done. Funds send to next account. ✅`);

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
