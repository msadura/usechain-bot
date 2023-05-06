import { ethers } from 'ethers';
import * as zksync from 'zksync-web3';

const ZKSYNC_RPC_URL = 'https://mainnet.era.zksync.io';

export function getL1Provider() {
  if (!process.env.INFURA_API_KEY) {
    throw new Error('INFURA_API_KEY env var is not set');
  }

  return new ethers.providers.InfuraProvider(1, process.env.INFURA_API_KEY);
}

export function getL2Provider() {
  return new zksync.Provider(ZKSYNC_RPC_URL);
}
