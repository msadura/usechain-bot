import { transferERC20FromWallet } from '@app/utils/transferERC20FromWallet';
import './aliases';
import dotenv from 'dotenv';
dotenv.config();

import { connectProvider, getProvider } from '@app/blockchain/provider';
import { activateArbitrumAccounts } from '@app/arbitrum/arbitrum';
import { generateMinions, getMinions } from '@app/minions/minions';
import { sendEthFromMinion } from '@app/utils/sendEthFromMinion';
import { activateEpsylonFTMAccounts } from '@app/fantom/epsylon/epsylon';
import { sendUSDCFromMinion } from '@app/fantom/epsylon/utils/sendUSDCFromMinion';
import { getQuoteExactOutputSingle } from '@app/trade/uniswap/quoter';
import { WETH } from '@app/arbitrum/constants';
import { ethers } from 'ethers';

async function main() {
  await connectProvider();

  // 1) Uncomment and run once to generate file with accounts
  // generateMinions(100);

  // 2) Send manually ETH to first minion account

  // 3) Uncomment to active generated minions
  // activateArbitrumAccounts();
  // activateEpsylonFTMAccounts();

  // 4) You can send back ETH to desired address or other minion by running:
  // const minions = getMinions();
  // const recipient = minions[10].address;
  // await sendEthFromMinion(7, recipient);
  // await sendUSDCFromMinion(7, recipient);
}

main();
