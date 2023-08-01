import { TradeAsset } from '@app/types';
import { Wallet } from 'zksync-web3';

import { formatEther, formatUnits } from 'ethers/lib/utils';
import { getPercentAmount } from '@app/utils/getPercentAmount';
import { getSwapAssetBalance } from '@app/utils/getSwapAssetBalance';
import { approveMaxToken } from '@app/utils/approveMaxToken';
import { WETH_ADDRESS } from '@app/zkSync/constants';
import { isSameAddress } from '@app/utils/isSameAddress';
import { Symbiosis, Token, TokenAmount } from 'symbiosis-js-sdk';
import { BigNumber } from 'ethers';

const symbiosis = new Symbiosis('mainnet', 'sdk-symbio-swap');

type SwapConfig = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
  chainIn: number;
  chainOut?: number;
};

type Params = {
  wallet: Wallet;
} & SwapConfig;

export async function swap({ assetIn, assetOut, wallet, chainIn, chainOut }: Params) {
  const swapChainIn = chainIn;
  const swapChainOut = chainOut || chainIn;

  const isETHIn = isSameAddress(assetIn.address, WETH_ADDRESS);
  const isETHOut = isSameAddress(assetOut.address, WETH_ADDRESS);
  const assetBalance = await getSwapAssetBalance({
    assetIn,
    signer: wallet,
    wethAddress: WETH_ADDRESS
  });
  // swap 80% of the balance if it is gas asset
  const amountIn = isETHIn ? getPercentAmount(assetBalance, 90) : assetBalance;

  if (amountIn.isZero()) {
    throw Error(
      `🔴 Not enough balance - ${formatUnits(assetBalance, assetIn.decimals)} ${assetIn.name} `
    );
  }

  const tokenIn = new Token({
    chainId: swapChainIn,
    address: isETHIn ? '' : assetIn.address,
    isNative: isETHIn,
    symbol: assetIn.name,
    decimals: assetIn.decimals
  });
  const tokenAmountIn = new TokenAmount(tokenIn, amountIn.toString());
  console.log('🔥', tokenIn);
  const tokenOut = new Token({
    chainId: swapChainOut,
    isNative: isETHOut,
    address: isETHOut ? '' : assetOut.address,
    symbol: assetOut.name,
    decimals: assetOut.decimals
  });
  console.log('🔥', tokenOut);

  const swapping = symbiosis.bestPoolSwapping();

  // Calculates fee for swapping between chains and transactionRequest
  console.log('Calculating swap...');
  try {
    const { transactionRequest, fee, tokenAmountOut, route, priceImpact, approveTo } =
      await swapping.exactIn({
        tokenAmountIn, // TokenAmount object
        tokenOut, // Token object
        from: wallet.address, // from account address
        to: wallet.address, // to account address
        revertableAddress: wallet.address, // account who can revert stucked transaction
        slippage: 100, // 1% slippage
        deadline: Date.now() + 20 * 60 // 20 minutes deadline
      });
    console.log({
      tokenAmountIn: tokenAmountIn.toSignificant(),
      fee: fee.toSignificant(),
      tokenAmountOut: tokenAmountOut.toSignificant(),
      route: route.map((i: any) => i.symbol).join(' -> '),
      priceImpact: priceImpact.toSignificant()
    });

    if (!isETHIn) {
      // swap tokens for eth
      await approveMaxToken({
        tokenAddress: assetIn.address,
        amountIn,
        signer: wallet,
        spenderAddress: approveTo
      });
    }

    console.log({
      tokenAmountIn: tokenAmountIn.toSignificant(),
      fee: fee.toSignificant(),
      tokenAmountOut: tokenAmountOut.toSignificant(),
      route: route.map((i: any) => i.symbol).join(' -> '),
      priceImpact: priceImpact.toSignificant()
    });

    // Send transaction to chain
    const transactionResponse = await wallet.sendTransaction(transactionRequest);
    console.log('Transaction sent', transactionResponse.hash);

    // Wait for transaction to be mined
    const receipt = await transactionResponse.wait(1);
    console.log('Transaction mined', receipt.transactionHash);

    // Wait for transaction to be completed on recipient chain
    const log = await swapping.waitForComplete(receipt);
    console.log('Cross-chain swap completed', log.transactionHash);
  } catch (e) {
    console.error(e);
  }
}
