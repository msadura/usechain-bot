import { parseEther } from 'ethers/lib/utils';
import { Wallet } from 'zksync-web3';

export async function waitForZkFunds(wallet: Wallet, initBalance?: string): Promise<void> {
  console.log('🔥', 'Waiting for L2 funds...');
  const compareBalance = initBalance ? parseEther(initBalance) : await wallet.getBalance();
  // TODO - throw if it takes too long

  return new Promise(resolve => {
    const interval = setInterval(async () => {
      const balance = await wallet.getBalance();
      if (balance.gt(compareBalance)) {
        clearInterval(interval);
        console.log('🔥', 'L2 funds received!');
        resolve();
      }
    }, 5000);
  });
}
