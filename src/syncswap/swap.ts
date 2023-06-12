import { CLASSIC_POOL_FACTORY_ADDRESS, WETH_ADDRESS } from '@app/syncswap/constants';
import { TradeAsset } from '@app/types';
import { Contract, Wallet } from 'zksync-web3';
import classicPoolFactoryAbi from '@app/syncswap/abi/classicPoolFactory.json';
import routerAbi from '@app/syncswap/abi/router.json';
import classicPoolAbi from '@app/syncswap/abi/classicPool.json';
import { BigNumber, ethers } from 'ethers';
import { ZERO_ADDRESS } from '@app/constants';
import { defaultAbiCoder } from 'ethers/lib/utils';

type SyncSwapConfig = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
};

type Params = {
  wallet: Wallet;
} & SyncSwapConfig;

export async function swap({ assetIn, assetOut, wallet }: Params) {
  const isETHIn = assetIn.address === WETH_ADDRESS;

  // The factory of the Classic Pool.
  const classicPoolFactory = new Contract(
    CLASSIC_POOL_FACTORY_ADDRESS,
    classicPoolFactoryAbi,
    wallet
  );

  const poolAddress: string = await classicPoolFactory.getPool(assetIn.address, assetOut.address);
  console.log('🔥pool', poolAddress);
  // Checks whether the pool exists.
  if (poolAddress === ZERO_ADDRESS) {
    throw Error('Pool not exists');
  }

  // Gets the reserves of the pool.
  const pool: Contract = new Contract(poolAddress, classicPoolAbi, wallet);

  const withdrawMode = 1; // 1 or 2 to withdraw to user's wallet

  const swapData: string = defaultAbiCoder.encode(
    ['address', 'address', 'uint8'],
    [assetIn.address, wallet.address, withdrawMode] // tokenIn, to, withdraw mode
  );

  // We have only 1 step.
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

  // We have only 1 path.
  const paths = [
    {
      steps: steps,
      tokenIn: tokenInAddress,
      amountIn: '0.01'
    }
  ];
}
