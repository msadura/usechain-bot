export type NetworkType = 'mainnet' | 'testnet';

export type SupportedNetwork = 'rinkeby';

export type TradeAsset = {
  name: string;
  address: string;
  decimals: number;
  tradeAmount?: string;
};
