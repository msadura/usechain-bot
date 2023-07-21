import { getEthBalance } from '@app/rhinofi/client/getBalance';
import { RhinoClient } from '@app/rhinofi/client/getClient';
import { ethers } from 'ethers';

export async function waitForEthFunds({
  rhinofi,
  initBalance
}: {
  rhinofi: RhinoClient;
  initBalance?: ethers.BigNumber;
}): Promise<void> {
  const compareBalance = initBalance || (await getEthBalance(rhinofi));

  return new Promise(resolve => {
    const interval = setInterval(async () => {
      const balance = await getEthBalance(rhinofi);

      if (balance.gt(compareBalance)) {
        clearInterval(interval);
        console.log('🔥', 'Rhino funds received!');
        resolve();
      }
    }, 10000);
  });
}
