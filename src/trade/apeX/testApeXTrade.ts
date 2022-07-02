import { APEX_ROUTER_ADDRESS, USDC, WETH } from '@app/arbitrum/constants';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getMinions } from '@app/minions/minions';
import { getApeXAction } from '@app/trade/apeX/ApeX';

export const testApeXTrade = async () => {
  const minions = getMinions();
  const signer = getSignerFromMnemonic(minions[2].mnemonic);

  const tradeApex = getApeXAction({
    weth: WETH,
    asset: USDC,
    swapRouterAddress: APEX_ROUTER_ADDRESS
  });

  await tradeApex(signer);
};
