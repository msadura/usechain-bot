import { QUOTER_ADDRESS } from '@app/trade/uniswap/constants';
import { TradeConfig } from '@app/trade/uniswap/types';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { Contract, ethers } from 'ethers';

export const getQuoteExactOutputSingle = async (
  trade: TradeConfig,
  provides: ethers.Wallet | ethers.providers.Provider
) => {
  const quoterContract = new Contract(QUOTER_ADDRESS, QuoterABI, provides);

  return quoterContract.callStatic.quoteExactOutputSingle(
    trade.tokenIn.address,
    trade.tokenOut.address,
    trade.fee,
    ethers.utils.parseUnits(trade.amount, trade.tokenOut.decimals),
    0
  );
};
