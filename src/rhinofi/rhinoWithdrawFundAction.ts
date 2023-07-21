import { activateAccounts } from '@app/process/activateAccounts';
import { ActivateAction } from '@app/process/types';
import { withdrawAllFunds } from '@app/rhinofi/client/withdrawAllFunds';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

const rhinoWithdrawFundAccounts: ActivateAction = async ({ minion }) => {
  const wallet = getZkSyncSignerFromMnemonic(minion.mnemonic);
  await withdrawAllFunds({ wallet, chain: 'ZKSYNC', dtk: minion.dtk });

  return true;
};

export const rhinoWithdrawAccountsAction = async () => {
  await activateAccounts([rhinoWithdrawFundAccounts], {
    skipPostAction: true,
    skipBalanceCheck: true,
    skipGasCheck: true
  });
};
