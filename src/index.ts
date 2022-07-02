import './aliases';
import dotenv from 'dotenv';
dotenv.config();

import { connectProvider } from '@app/blockchain/provider';
import { activateArbitrumAccounts } from '@app/arbitrum/arbitrum';

async function main() {
  await connectProvider();

  // 1) Uncomment and run once to generate file with accounts
  // generateMinions(20);

  // 2) Send manually ETH to first minion account

  // 3) Uncomment to active generated minions
  activateArbitrumAccounts();
}

main();
