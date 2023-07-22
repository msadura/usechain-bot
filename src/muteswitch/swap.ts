import { TradeAsset } from '@app/types';
import { Contract, Wallet } from 'zksync-web3';
import routerAbi from './abi/router.json';
import { ethers } from 'ethers';

import { formatUnits } from 'ethers/lib/utils';
import { getPercentAmount } from '@app/utils/getPercentAmount';
import { getSwapAssetBalance } from '@app/utils/getSwapAssetBalance';
import { approveMaxToken } from '@app/utils/approveMaxToken';
import { WETH_ADDRESS } from '@app/zkSync/constants';

const routerAddress = '0x8B791913eB07C32779a16750e3868aA8495F5964';

type SwapConfig = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
};

type Params = {
  wallet: Wallet;
} & SwapConfig;

export async function swap({ assetIn, assetOut, wallet }: Params) {
  const router = new Contract(routerAddress, routerAbi, wallet);

  const isETHIn = assetIn.address.toLowerCase() === WETH_ADDRESS.toLowerCase();

  console.log('🔥', isETHIn, assetIn.address, WETH_ADDRESS);
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

  // get swap quote
  const [amountOut, isStable, fee] = await router.getAmountOut(
    amountIn,
    assetIn.address,
    assetOut.address
  );

  // apply max 1% slippage
  const amountOutMin = getPercentAmount(amountOut, 99);

  // contract args
  const minOut = amountOutMin;
  const path = [assetIn.address, assetOut.address];
  const recipient = wallet.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10min
  const stable = assetOut.stable ? [true, false] : [false, false];

  if (!isETHIn) {
    // swap tokens for eth
    await approveMaxToken({
      tokenAddress: assetIn.address,
      amountIn,
      signer: wallet,
      spenderAddress: routerAddress
    });

    console.log('🔥', `swap tokens ${assetOut.name} to ETH`);

    const response = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
      amountIn,
      minOut,
      path,
      recipient,
      deadline,
      stable,
      {
        gasLimit: ethers.utils.hexlify(1000000)
      }
    );

    await response.wait();
  } else {
    console.log('🔥', `swap ETH for tokens ${assetOut.name}`);
    // swap eth for tokens
    const response = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
      minOut,
      path,
      recipient,
      deadline,
      stable,
      {
        value: amountIn,
        gasLimit: ethers.utils.hexlify(1000000)
      }
    );

    await response.wait();
  }
}
