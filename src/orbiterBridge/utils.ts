import { OrbitermakerConfig } from '@app/orbiterBridge/types';
import BigNumber from 'bignumber.js';

export function getTransferAmount({
  transferValue,
  makerConfig
}: {
  transferValue: string;
  makerConfig: OrbitermakerConfig;
}) {
  const rAmount = new BigNumber(transferValue)
    .plus(new BigNumber(makerConfig.tradingFee))
    .multipliedBy(new BigNumber(10 ** makerConfig.fromChain.decimals));
  const rAmountValue = rAmount.toFixed();
  const amountLength = rAmountValue.toString().length;
  // This is important for bridge to recognize target chain
  const pText = 9000 + Number(makerConfig.toChain.id) + '';

  const tAmount = rAmountValue.toString().slice(0, amountLength - pText.length) + pText;

  return tAmount;
}

export function getDigitByPrecision(precision: number) {
  return precision === 18 ? 6 : 2;
}
