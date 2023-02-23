import { getMinions, getNextAccount } from '@app/minions/minions';
import { sendEthFromMinion } from '@app/utils/sendEthFromMinion';

export async function transferEthToNextMinion() {
  const minions = getMinions();
  const recipientMinion = getNextAccount(minions);
  if (!recipientMinion) {
    return;
  }

  const prevMinion = minions[recipientMinion.id - 1];
  await sendEthFromMinion(prevMinion.id, recipientMinion.address);
}
