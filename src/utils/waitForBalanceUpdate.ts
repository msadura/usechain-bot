import { Wallet, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export async function waitForBalanceUpdate({
  wallet,
  initBalance,
  retryInterval = 5000
}: {
  wallet: Wallet;
  initBalance?: ethers.BigNumber;
  retryInterval?: number;
}): Promise<void> {
  console.log('🔥', 'Waiting for balance update...');
  const compareBalance = initBalance ? initBalance : await wallet.getBalance();
  // TODO - throw if it takes too long

  return new Promise(resolve => {
    const interval = setInterval(async () => {
      const balance = await wallet.getBalance();
      if (balance.gt(compareBalance)) {
        clearInterval(interval);
        console.log('🔥', 'Wallet funds received! Updated balance:', formatEther(balance));
        resolve();
      }
    }, retryInterval || 5000);
  });
}
