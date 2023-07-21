import { getBrowserInstance, hasBrowserInstance } from '@app/e2e/browserInstance';
import { importNextAccount } from '@app/e2e/utils/importNextAccount';
import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { activateAccounts } from '@app/process/activateAccounts';
import { ActivateAction } from '@app/process/types';
import { connectWallet } from '@app/rhinofi/utils/connectWallet';

const rhinoRecoverE2EAction: ActivateAction = async ({ minion, recipient }) => {
  if (minion.dtk) {
    return true;
  }

  if (!hasBrowserInstance()) {
    await setupMMFistAccount({ seed: minion.mnemonic });
  }

  await connectWallet({ minion });

  if (recipient) {
    const mm = getBrowserInstance().mm;
    await importNextAccount({ seed: recipient.mnemonic, mm });
  }

  return true;
};

export const recoverRhinoAccounts = async () => {
  await activateAccounts([rhinoRecoverE2EAction], {
    skipPostAction: true,
    skipBalanceCheck: true,
    skipGasCheck: true,
    skipDoneCheck: true
  });
};
