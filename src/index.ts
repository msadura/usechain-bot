import './aliases';
import dotenv from 'dotenv';
dotenv.config();

import { connectProvider } from '@app/blockchain/provider';
import { activateArbitrumAccounts } from '@app/arbitrum/arbitrum';
import { generateMinions, getMinions } from '@app/minions/minions';
import { sendEthFromMinion } from '@app/utils/sendEthFromMinion';

async function main() {
  await connectProvider();

  // 1) Uncomment and run once to generate file with accounts
  // generateMinions(10);

  // 2) Send manually ETH to first minion account

  // 3) Uncomment to active generated minions
  activateArbitrumAccounts();

  // 4) You can send back ETH to desired address or other minion by running:
  // const minions = getMinions();
  // const recipient = minions[8].address;
  // sendEthFromMinion(7, recipient);
}

main();
