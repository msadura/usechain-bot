import {
  CLASSIC_POOL_FACTORY_ADDRESS,
  ROUTER_ADDRESS,
  WETH_ADDRESS
} from '@app/syncswap/constants';
import { TradeAsset } from '@app/types';
import { Contract, Wallet } from 'zksync-web3';
import classicPoolFactoryAbi from '@app/syncswap/abi/classicPoolFactory.json';
import routerAbi from '@app/syncswap/abi/router.json';
import classicPoolAbi from '@app/syncswap/abi/classicPool.json';
import { BigNumber } from 'ethers';
import { ZERO_ADDRESS } from '@app/constants';
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils';
import { getPercentAmount } from '@app/utils/getPercentAmount';
import { getSwapAssetBalance } from '@app/utils/getSwapAssetBalance';
import { approveMaxToken } from '@app/utils/approveMaxToken';

type SyncSwapConfig = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
};

type Params = {
  wallet: Wallet;
} & SyncSwapConfig;

export async function swap({ assetIn, assetOut, wallet }: Params) {
  const isETHIn = assetIn.address === WETH_ADDRESS;
  const assetBalance = await getSwapAssetBalance({
    assetIn,
    signer: wallet,
    wethAddress: WETH_ADDRESS
  });

  // swap 80% of the balance
  const amountIn = isETHIn ? getPercentAmount(assetBalance, 80) : assetBalance;

  // The factory of the Classic Pool.
  const classicPoolFactory = new Contract(
    CLASSIC_POOL_FACTORY_ADDRESS,
    classicPoolFactoryAbi,
    wallet
  );

  const poolAddress: string = await classicPoolFactory.getPool(assetIn.address, assetOut.address);
  console.log('🔥 pool', poolAddress);
  // Checks whether the pool exists.
  if (poolAddress === ZERO_ADDRESS) {
    throw Error('Pool not exists');
  }

  // Gets the reserves of the pool.
  const pool: Contract = new Contract(poolAddress, classicPoolAbi, wallet);

  // get swap quote
  const quoteOut = await pool.getAmountOut(assetIn.address, amountIn, wallet.address);
  console.log(
    '🔥 swap quote:',
    formatUnits(amountIn, assetIn.decimals),
    assetIn.name,
    '->',
    formatUnits(quoteOut, assetOut.decimals),
    assetOut.name
  );

  // apply max 1% slippage
  const amountOutMin = getPercentAmount(quoteOut, 99);
  const withdrawMode = 1; // 1 or 2 to withdraw to user's wallet
  const swapData: string = defaultAbiCoder.encode(
    ['address', 'address', 'uint8'],
    [assetIn.address, wallet.address, withdrawMode] // tokenIn, to, withdraw mode
  );

  const steps = [
    {
      pool: poolAddress,
      data: swapData,
      callback: ZERO_ADDRESS, // we don't have a callback
      callbackData: '0x'
    }
  ];

  // If we want to use the native ETH as the input token,
  // the `tokenIn` on path should be replaced with the zero address.
  // Note: however we still have to encode the wETH address to pool's swap data.
  const tokenInAddress = isETHIn ? ZERO_ADDRESS : assetIn.address;

  const paths = [
    {
      steps: steps,
      tokenIn: tokenInAddress,
      amountIn
    }
  ];

  const router: Contract = new Contract(ROUTER_ADDRESS, routerAbi, wallet);

  if (!isETHIn) {
    await approveMaxToken({
      tokenAddress: assetIn.address,
      amountIn,
      signer: wallet,
      spenderAddress: ROUTER_ADDRESS
    });
  }

  // The router will handle the deposit to the pool's vault account.
  const response = await router.swap(
    paths,
    amountOutMin,
    BigNumber.from(Math.floor(Date.now() / 1000)).add(300), // deadline // 5 minutes
    {
      value: amountIn
    }
  );

  await response.wait();
}
