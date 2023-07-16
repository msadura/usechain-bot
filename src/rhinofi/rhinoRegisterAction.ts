import { hasBrowserInstance } from '@app/e2e/browserInstance';
import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { activateAccounts } from '@app/process/activateAccounts';
import { ActivateAction } from '@app/process/types';
import { registerAccount } from '@app/rhinofi/utils/registerAccount';

const rhinoRegisterAction: ActivateAction = async ({ minion }) => {
  if (!hasBrowserInstance()) {
    await setupMMFistAccount({ seed: minion.mnemonic });
  }

  await registerAccount({ minion });

  return true;
};

export const registerRhinoAccounts = async () => {
  await activateAccounts([rhinoRegisterAction], {
    skipPostAction: true,
    skipBalanceCheck: true,
    skipGasCheck: true
  });
};
