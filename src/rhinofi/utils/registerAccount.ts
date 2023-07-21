import { getRhinoClient } from '@app/rhinofi/client/getClient';
import { register } from '@app/rhinofi/client/register';
import { Wallet } from 'ethers';

export async function registerAccount({ wallet }: { wallet: Wallet }) {
  const rhinofi = await getRhinoClient(wallet.privateKey);

  await register({ rhinofi, wallet });
}
