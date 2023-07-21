import { RhinoClient } from '@app/rhinofi/client/getClient';
import { parseRhinoEther } from '@app/rhinofi/utils/parseRhinoEther';
import { formatEther } from 'ethers/lib/utils';

export async function getEthBalance(rhinofi: RhinoClient) {
  const res = await rhinofi.getBalance();
  const ethEntry = res.find((entry: any) => entry.token === 'ETH');

  const balance = parseRhinoEther(ethEntry.available || '0');
  console.log('🔥 Rhino ETH balance:', formatEther(balance));

  return balance;
}
