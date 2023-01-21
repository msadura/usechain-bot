import { TradeAsset } from '@app/types';

export type TradeConfig = {
  tokenIn: TradeAsset;
  tokenOut: TradeAsset;
  fee: string;
  amount: string;
};
