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

export function getProvider(chain: ethers.providers.Networkish = 1) {
  if (!process.env.INFURA_API_KEY) {
    throw new Error('INFURA_API_KEY env var is not set');
  }

  return new ethers.providers.InfuraProvider(chain, process.env.INFURA_API_KEY);
}

export function getConnectedProvider() {
  return provider as ethers.providers.Provider;
}
