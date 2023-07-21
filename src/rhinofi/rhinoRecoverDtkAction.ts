import { activateAccounts } from '@app/process/activateAccounts';
import { ActivateAction } from '@app/process/types';
import { connectWallet } from '@app/rhinofi/utils/connectWallet';

const rhinoRecoverE2EAction: ActivateAction = async ({ minion }) => {
  await connectWallet({ minion });

  return true;
};

export const recoverRhinoAccounts = async () => {
  await activateAccounts([rhinoRecoverE2EAction], {
    skipPostAction: true,
    skipBalanceCheck: true,
    skipGasCheck: true
  });
};
