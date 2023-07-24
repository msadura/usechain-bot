import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getBrowserInstance } from '@app/e2e/browserInstance';
import { connectWallet } from '@app/e2e/testnetBridge/connectWallet';
import { MinionAccount } from '@app/minions/minions';
import { wait } from '@app/utils/wait';
import { waitForBalanceUpdate } from '@app/utils/waitForBalanceUpdate';
import { formatEther } from 'ethers/lib/utils';

type Params = {
  amountIn: string;
  minion: MinionAccount;
};

const bridgeUrl = 'https://testnetbridge.com';

export async function ethToGoerli({ amountIn = '0.0005', minion }: Params) {
  const { mm, dappPage } = getBrowserInstance();
  const wallet = getSignerFromMnemonic(minion.mnemonic, 'goerli');
  const initBalance = await wallet.getBalance();
  console.log('🔥 goerli balance:', formatEther(initBalance));

  await connectWallet(bridgeUrl);

  await dappPage.bringToFront();
  const searchInput = await dappPage.waitForSelector('//input[@placeholder="0.0"]');
  await searchInput.type(amountIn);
  await dappPage
    .waitForSelector('//button[contains(text(), "Transfer")]')
    .then(el => el?.click?.());

  await mm.confirmTransaction();

  /// how to check if tx succeeds?

  await waitForBalanceUpdate({ wallet, initBalance });
  await wait(5000);
}
