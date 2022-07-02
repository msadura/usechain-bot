import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getMinions } from '@app/minions/minions';
import { getGasValue } from '@app/utils/getGasValue';

export const sendEthFromMinion = async (minionId: number, recipient: string) => {
  const minions = getMinions();
  const minion = minions.find(m => m.id === minionId);

  if (!minion) {
    throw `Cannot find minion with id ${minionId}. Cnnot send funds`;
  }

  const signer = getSignerFromMnemonic(minion.mnemonic);
  const balance = await signer.getBalance();
  const { gasValue, gasPrice, gasLimit } = await getGasValue();
  const balanceOut = balance.sub(gasValue);

  if (balanceOut.lte(0)) {
    throw 'No balance to send to next account';
  }

  const tx = await signer.sendTransaction({
    to: recipient,
    value: balanceOut,
    gasPrice,
    gasLimit
  });

  await tx.wait();
};
