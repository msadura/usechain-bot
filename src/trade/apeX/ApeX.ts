import { TradeAsset } from '@app/types';
import { ethers } from 'ethers';
import { BigNumber, Wallet } from 'ethers/lib/ethers';
import { formatUnits, formatEther } from 'ethers/lib/utils';
import ApeXRouterABI from '@app/trade/apeX/abi/ApeXRouter.json';

type Config = {
  weth: TradeAsset;
  asset: TradeAsset;
  swapRouterAddress: string;
};

type Params = {
  signer: Wallet;
} & Config;

export const ApeX = async ({ weth, asset, signer, swapRouterAddress }: Params) => {
  const routerContract = new ethers.Contract(swapRouterAddress, ApeXRouterABI, signer);

  const inBalance: BigNumber = await signer.getBalance();
  console.log(`🔥 ${weth.name} balance: `, formatEther(inBalance));

  const amountEth = inBalance.div(100).mul(80);
  const side = 0; // buy - long

  const quoteAmount = await routerContract.getQuoteAmount(
    weth.address,
    asset.address,
    side,
    amountEth
  );

  // TODO
  // open position
  // close position
};

export const getApeXAction = (config: Config) => {
  return (signer: Wallet) => ApeX({ ...config, signer });
};
