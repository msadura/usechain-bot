import { TradeAsset } from '@app/types';

// MAINNET
export const SUSHI_ROUTER_ADDRESS = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506';
export const SWAPR_ROUTER_ADDRESS = '0x530476d5583724A89c8841eB6Da76E7Af4C0F17E';
export const APEX_ROUTER_ADDRESS = '0x146c57aBB43a5B457cd8E109D35Ac27057a672e2';

//MAINNET
export const WETH: TradeAsset = {
  name: 'ETH',
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  decimals: 18
};

export const USDC: TradeAsset = {
  name: 'USDC',
  address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  decimals: 6
};
