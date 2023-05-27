export type OrbiterChain = {
  id: number;
  name: string;
  tokenAddress: string;
  symbol: string;
  decimals: number;
  minPrice?: number;
  maxPrice?: number;
};

export type OrbitermakerConfig = {
  id: string;
  makerId: string;
  ebcId: string;
  slippage: number;
  makerAddress: string;
  sender: string;
  tradingFee: number;
  gasFee: number;
  fromChain: OrbiterChain;
  toChain: OrbiterChain;
  times: number[];
  crossAddress: unknown;
};
