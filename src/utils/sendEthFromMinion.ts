import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getMinions } from '@app/minions/minions';
import { transferEthFromWallet } from '@app/utils/transferEthFromWallet';

export const sendEthFromMinion = async (minionId: number, recipient: string) => {
  const minions = getMinions();
  const minion = minions.find(m => m.id === minionId);

  if (!minion) {
    throw `Cannot find minion with id ${minionId}. Cnnot send funds`;
  }

  const signer = getSignerFromMnemonic(minion.mnemonic);
  await transferEthFromWallet(signer, recipient);
};
