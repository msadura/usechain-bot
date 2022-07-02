import { RPC_URL } from '@app/constants';
import { ethers } from 'ethers';

let provider: ethers.providers.StaticJsonRpcProvider;

export async function connectProvider() {
  provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
  console.log('🔥 Http provider info:', RPC_URL);
  await provider.ready;
  console.log('🔥 Http provider connected');

  return provider;
}

export function getProvider() {
  return provider as ethers.providers.Provider;
}
