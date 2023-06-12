import { BigNumber, BigNumberish } from 'ethers';

export function getPercentAmount(amountIn: BigNumberish, percent: number) {
  return BigNumber.from(amountIn).div(100).mul(percent);
}
