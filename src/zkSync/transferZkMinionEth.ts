import { getMinions } from '@app/minions/minions';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';
import { transferZkEth } from '@app/zkSync/transferZkEth';

export async function transferZkMinionEth({
  senderId,
  recipientId,
  minAccountBalance = '0'
}: {
  senderId: number;
  recipientId?: number;
  minAccountBalance?: string;
}) {
  const minions = getMinions();
  const recipientMinionId = typeof recipientId === 'undefined' ? senderId + 1 : recipientId;
  const sender = minions[senderId];
  const recipient = minions[recipientMinionId];

  const wallet = getZkSyncSignerFromMnemonic(sender.mnemonic);

  await transferZkEth({ wallet, recipient: recipient.address, minAccountBalance });
}
