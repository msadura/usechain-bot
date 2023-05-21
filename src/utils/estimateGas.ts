import { ethers } from 'ethers';

export async function estimateGas(
  provider: ethers.providers.Provider,
  tx: ethers.providers.TransactionRequest
) {
  return provider.estimateGas(tx);
}
