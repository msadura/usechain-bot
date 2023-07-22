import { TradeAsset } from '@app/types';
import { Contract, Wallet } from 'zksync-web3';
import { ethers } from 'ethers';

import { formatUnits } from 'ethers/lib/utils';
import { getPercentAmount } from '@app/utils/getPercentAmount';
import { getSwapAssetBalance } from '@app/utils/getSwapAssetBalance';
import { approveMaxToken } from '@app/utils/approveMaxToken';
import { WETH_ADDRESS } from '@app/zkSync/constants';
import { isSameAddress } from '@app/utils/isSameAddress';

const routerAbi = [
  `function swap(
    address fromToken,
    address toToken,
    uint256 fromAmount,
    uint256 minToAmount,
    address payable to,
    address rebateTo
) external payable returns (uint256 realToAmount)`,
  `function querySwap(
  address fromToken,
  address toToken,
  uint256 fromAmount
) external view returns (uint256 toAmount)`
];

const routerAddress = '0xfd505702b37Ae9b626952Eb2DD736d9045876417';

const ETH_SWAP_PALCEHOLDER = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

type SwapConfig = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
};

type Params = {
  wallet: Wallet;
} & SwapConfig;

export async function swap({ assetIn, assetOut, wallet }: Params) {
  const router = new Contract(routerAddress, routerAbi, wallet);

  const isETHIn = isSameAddress(assetIn.address, WETH_ADDRESS);

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
  const amountOut = await router.querySwap(assetIn.address, assetOut.address, amountIn);

  // apply max 1% slippage
  const amountOutMin = getPercentAmount(amountOut, 99);

  // contract args
  const minOut = amountOutMin;
  const recipient = wallet.address;
  const swapAssetIn = isETHIn ? ETH_SWAP_PALCEHOLDER : assetIn.address;
  const swapAssetOut = isSameAddress(WETH_ADDRESS, assetOut.address)
    ? ETH_SWAP_PALCEHOLDER
    : assetOut.address;

  if (!isETHIn) {
    // swap tokens for eth
    await approveMaxToken({
      tokenAddress: assetIn.address,
      amountIn,
      signer: wallet,
      spenderAddress: routerAddress
    });
  }

  console.log(
    '🔥',
    `Swap ${formatUnits(amountIn, assetIn.decimals)} ${assetIn.name} -> ${formatUnits(
      minOut,
      assetOut.decimals
    )} ${assetOut.name}`
  );

  const response = await router.swap(
    swapAssetIn,
    swapAssetOut,
    amountIn,
    minOut,
    recipient,
    recipient,
    {
      value: amountIn,
      gasLimit: ethers.utils.hexlify(1000000)
    }
  );

  await response.wait();
}
