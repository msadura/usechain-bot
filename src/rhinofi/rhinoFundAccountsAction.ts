import { activateAccounts } from '@app/process/activateAccounts';
import { ActivateAction } from '@app/process/types';
import { fundAccount } from '@app/rhinofi/client/fundAccount';
import { getScriptArgs } from '@app/utils/getScriptArgs';

const rhinoFundAccounts: ActivateAction = async ({ wallet }) => {
  const ethAmount = getScriptArgs().amount || '0.011';
  console.log('🔥 Feed amount:', ethAmount);

  await fundAccount({ address: wallet.address, amount: ethAmount });

  return true;
};

export const rhinoFundAccountsAction = async () => {
  await activateAccounts([rhinoFundAccounts], {
    skipPostAction: true,
    skipBalanceCheck: true,
    skipGasCheck: true
  });
};
