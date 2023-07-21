import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export function formatRhinoEther(amount: BigNumber) {
  // For some reason rhino api returns and accepts amounts as 10 decimals instead of 18
  return formatUnits(amount, 10).replace(/\..+$/, '');
}
