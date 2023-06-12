import { transferERC20FromWallet } from '@app/utils/transferERC20FromWallet';
import './aliases';
import dotenv from 'dotenv';
dotenv.config();

import { connectProvider, getProvider } from '@app/blockchain/provider';
import { activateArbitrumAccounts } from '@app/arbitrum/arbitrum';
import { generateMinions, getMinions } from '@app/minions/minions';
import { sendEthFromMinion } from '@app/utils/sendEthFromMinion';
import { sendUSDCFromMinion } from '@app/fantom/epsylon/utils/sendUSDCFromMinion';
import { getQuoteExactOutputSingle } from '@app/trade/uniswap/quoter';
import { WETH } from '@app/arbitrum/constants';
import { ethers } from 'ethers';
import { activateCamelotAccounts } from '@app/arbitrum/camelot/camelot';
import { transferEthToNextMinion } from '@app/utils/transferEthToNextMinion';

import { testOrbiter } from '@app/orbiterBridge/testOrbiter';
import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { activateZkBridgeAccounts } from '@app/zkSync/bridgeZkAction';
import { testPostSyncSwap, testSyncSwap } from '@app/syncswap/testSyncSwap';
import { transferZkMinionEth } from '@app/zkSync/transferZkMinionEth';
import { activateSyncSwapAccounts } from '@app/syncswap/syncSwapAction';

async function main() {
  // await connectProvider();
  // try {
  //   await transferEthToNextMinion();
  //   console.log('🔥', 'Transfered ETH to next minion');
  // } catch (e) {
  //   console.log('Transfer to next minion not needed', e);
  // }
  // 1) Uncomment and run once to generate file with accounts
  // generateMinions(100);
  // 2) Send manually ETH to first minion account
  // 3) Uncomment to active generated minions
  // activateArbitrumAccounts();
  // activateCamelotAccounts();
  // 4) You can send back ETH to desired address or other minion by running:
  // const minions = getMinions();
  // const recipient = minions[89].address;
  // await sendEthFromMinion(99, '0x7d3019a42Dc5729852F643f540170a27727c7C80');
  // await sendUSDCFromMinion(7, recipient);

  // TESTING
  // await test();
  // await testOrbiter();
  // await testSyncSwap();
  // await testPostSyncSwap();
  // await transferZkMinionEth({ senderId: 1, recipientId: 0 });

  // ZK SYNC ACTIONS
  // await activateZkBridgeAccounts();
  await activateSyncSwapAccounts();
}

main();
