import { parseUnits } from 'ethers/lib/utils';

export function parseRhinoEther(amount: string) {
  // For some reason rhino api returns and accepts amounts as 10 decimals instead of 18
  return parseUnits(amount, 10);
}
