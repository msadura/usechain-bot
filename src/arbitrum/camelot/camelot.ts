import { USDC, WETH } from '@app/arbitrum/constants';
import { activateAccounts } from '@app/actions/activateAccounts';
import { ActivateAction } from '@app/actions/types';
import { getCamelotAction } from '@app/arbitrum/camelot/getCamelotAction';

const CAMELOT_CONTRACT_ADDRESS = '0xc873fEcbd354f5A56E00E710B90EF4201db2448d';
const GRAIL_ADDRESS = '0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8';
const GRAIL = {
  address: GRAIL_ADDRESS,
  name: 'Grail',
  decimals: 18
};

export const getCamelotActions = (): ActivateAction[] => {
  // Buy USDC for ETH on camelot
  const sellWeth = getCamelotAction({
    assetIn: WETH,
    assetOut: USDC,
    wethAddress: WETH.address,
    swapRouterAddress: CAMELOT_CONTRACT_ADDRESS
  });

  // Sell back USDC for ETH
  const buyWeth = getCamelotAction({
    assetIn: USDC,
    assetOut: WETH,
    wethAddress: WETH.address,
    swapRouterAddress: CAMELOT_CONTRACT_ADDRESS
  });

  return [sellWeth, buyWeth];
};

export const activateCamelotAccounts = async () => {
  const actions = getCamelotActions();

  await activateAccounts(actions);
};
