import { activateAccounts } from '@app/process/activateAccounts';
import { ActivateAction } from '@app/process/types';
import { registerAccount } from '@app/rhinofi/utils/registerAccount';

const rhinoRegisterAction: ActivateAction = async ({ wallet }) => {
  await registerAccount({ wallet });

  return true;
};

export const registerRhinoAccounts = async () => {
  await activateAccounts([rhinoRegisterAction], {
    skipPostAction: true,
    skipBalanceCheck: true,
    skipGasCheck: true
  });
};
