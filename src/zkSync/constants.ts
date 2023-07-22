import { ZERO_ADDRESS } from '@app/constants';
import { TradeAsset } from '@app/types';

export const MAX_GAS_PRICE_BRIDGE = 25;

export const WETH_ADDRESS = '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91';
export const NATIVE_ETH_ADDRESS = ZERO_ADDRESS;

const USDC_ADDRESS = '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4';

export const USDC_ASSET: TradeAsset = {
  name: 'USDC',
  address: USDC_ADDRESS,
  decimals: 6,
  stable: true
};

export const WETH_ASSET: TradeAsset = {
  name: 'WETH',
  address: WETH_ADDRESS,
  decimals: 18
};
