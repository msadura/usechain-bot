import { getGasPrice } from '@app/utils/getGasPrice';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

export const isGasTooHigh = async (provider: ethers.providers.Provider, limit = 0) => {
  if (!limit) {
    return false;
  }

  const gasPrice = await getGasPrice(provider);

  return gasPrice.gt(parseUnits(String(limit), 'gwei'));
};
