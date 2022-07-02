import { ethers } from 'ethers';

export const getGasPrice = async (provider: ethers.providers.Provider) => {
  const price = await provider.getGasPrice();
  console.log('🔥', 'gas price:', ethers.utils.formatUnits(price, 'gwei'));

  return price;
};
