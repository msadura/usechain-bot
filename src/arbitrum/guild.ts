import { ActivateAction } from './../actions/types/index';
import { USDC, SUSHI_ROUTER_ADDRESS, WETH } from '@app/arbitrum/constants';
import { getV2SwapRouterAction } from '@app/trade/V2SwapRouter/V2SwapRouter';
import { activateAccounts } from '@app/actions/activateAccounts';

export const getArbitrumGuildActions = (): ActivateAction[] => {
  // Buy USDC for ETH on sushi
  const sellWeth = getV2SwapRouterAction({
    assetIn: WETH,
    assetOut: USDC,
    wethAddress: WETH.address,
    swapRouterAddress: SUSHI_ROUTER_ADDRESS
  });

  // Sell back USDC for ETH
  const buyWeth = getV2SwapRouterAction({
    assetIn: USDC,
    assetOut: WETH,
    wethAddress: WETH.address,
    swapRouterAddress: SUSHI_ROUTER_ADDRESS
  });

  return [sellWeth, buyWeth];
};

export const activateArbitrumAccounts = async () => {
  const actions = getArbitrumGuildActions();

  await activateAccounts(actions);
};
