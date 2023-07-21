import { bridgedEthWithdraw } from '@app/rhinofi/client/bridgedEthWithdraw';
import { getEthBalance } from '@app/rhinofi/client/getBalance';
import { getRhinoClient } from '@app/rhinofi/client/getClient';
import { formatEther } from 'ethers/lib/utils';

import { Wallet } from 'zksync-web3';

export async function withdrawAllFunds({
  wallet,
  chain,
  dtk
}: {
  wallet: Wallet;
  chain: 'ZKSYNC';
  dtk?: string;
}) {
  const rhinofi = await getRhinoClient(wallet.privateKey, dtk);

  const balance = await getEthBalance(rhinofi);

  if (balance.isZero()) {
    console.log('🔥', 'Empty account balance, skipping');
    return;
  }

  await bridgedEthWithdraw({ amount: formatEther(balance), rhinofi, chain, wallet });
}
