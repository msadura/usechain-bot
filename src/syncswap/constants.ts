import { ZERO_ADDRESS } from '@app/constants';
import { TradeAsset } from '@app/types';

export const WETH_ADDRESS = '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91';
export const ROUTER_ADDRESS = '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295';
export const CLASSIC_POOL_FACTORY_ADDRESS = '0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb';
export const NATIVE_ETH_ADDRESS = ZERO_ADDRESS;

const USDC_ADDRESS = '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4';

export const USDC_ASSET: TradeAsset = {
  name: 'USDC',
  address: USDC_ADDRESS,
  decimals: 6
};

export const WETH_ASSET: TradeAsset = {
  name: 'WETH',
  address: WETH_ADDRESS,
  decimals: 18
};
