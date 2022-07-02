import './aliases';
import dotenv from 'dotenv';
dotenv.config();

import { connectProvider } from '@app/blockchain/provider';
import { testApeXTrade } from '@app/trade/apeX/testApeXTrade';
import { activateArbitrumAccounts } from '@app/arbitrum/arbitrum';

const PORT = process.env.PORT || 3002;

async function main() {
  await connectProvider();

  activateArbitrumAccounts();

  // generateMinions(20);
  // activateAccounts();
  // uniswap();
  // sushi();
  // getGasPrice(getProvider());

  // await connectWallet();
  // const app = express();
  // app.listen(PORT, () => {
  //   console.log(`[ server ] ready on port ${PORT}`);
  // });
  // printAccountsWithSeeds(20, 21);
}

main();
