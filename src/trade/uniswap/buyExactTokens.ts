import { getMinions } from '@app/minions/minions';
import { getPoolImmutables, getPoolState, isTokenApproved } from './utils';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as IWETH9 } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/external/IWETH9.sol/IWETH9.json';
import SwapRouterABI from '@app/trade/uniswap/abi/SwapRouter02.json';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { BigNumber, ethers, Wallet } from 'ethers';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { formatEther } from 'ethers/lib/utils';
import { TradeAsset } from '@app/types';
import { getQuoteExactOutputSingle } from '@app/trade/uniswap/quoter';

type Config = {
  weth: TradeAsset;
  assetOut: TradeAsset;
  swapRouterAddress: string;
  wethAddress: string;
  outAmount: string;
};

type Params = {
  signer: Wallet;
} & Config;

export const buyExactTokens = async ({
  weth,
  assetOut,
  signer,
  swapRouterAddress,
  outAmount
}: Params) => {
  const swapRouterContract = new ethers.Contract(swapRouterAddress, SwapRouterABI, signer);
  const wethContract = new ethers.Contract(weth.address, IWETH9, signer);
  const wethBalance: BigNumber = await wethContract.balanceOf(signer.address);

  const amountIn: ethers.BigNumber = await getQuoteExactOutputSingle(
    {
      tokenIn: weth,
      tokenOut: assetOut,
      fee: '3000',
      amount: outAmount
    },
    signer
  );

  const wethToWrap = amountIn.sub(wethBalance);
  console.log('🔥 wrapping ETH:', formatEther(wethToWrap));
  const wrapTx = await wethContract.deposit({ value: wethToWrap });
  await wrapTx.wait();

  const isApproved = await isTokenApproved({
    tokenContract: wethContract,
    amount: amountIn,
    spender: swapRouterAddress,
    owner: signer.address
  });

  console.log('🔥', isApproved);
  if (!isApproved) {
    console.log('🔥', 'Approving token');
    const approvalTx = await wethContract.approve(swapRouterAddress, amountIn);
    await approvalTx.wait();
  }

  const params = {
    tokenIn: weth.address,
    tokenOut: assetOut.address,
    fee: '3000',
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 310,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0
  };
  console.log('🔥', params);

  const swapTx = await swapRouterContract.exactOutputSingle(params, {
    gasLimit: ethers.utils.hexlify(1000000)
  });
  const receipt = await swapTx.wait();

  console.log('🔥', receipt);
};
