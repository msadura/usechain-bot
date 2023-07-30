import { CHAIN_ID_TO_SYMBOL, SEND_GAS_LIMITS } from '@app/constants';

export function getSendGasLimit(chain: string | number) {
  const chainSymbol = typeof chain === 'number' ? CHAIN_ID_TO_SYMBOL[chain] : chain.toLowerCase();

  return SEND_GAS_LIMITS[chainSymbol] || 21000;
}
