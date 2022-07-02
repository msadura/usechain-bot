import { getProvider } from '@app/blockchain/provider';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

export async function getGasValue(gasLimit = 21000, gasPrice?: null | BigNumber | number | string) {
  let price = gasPrice;
  if (!price) {
    price = await getProvider().getGasPrice();
    console.log('🔥', 'Loaded gas price', formatUnits(price, 'gwei'));
  } else if (typeof price === 'string' || typeof price === 'number') {
    price = parseUnits(price.toString(), 'gwei');
  }

  const limit = BigNumber.from(gasLimit);
  const gasValue = price.mul(limit);

  return { gasValue, gasPrice: price, gasLimit };
}
