import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { ActivateZkAction } from '@app/zkSync/types';

import { getBrowserInstance, hasBrowserInstance } from '@app/e2e/browserInstance';
import { setupMMFistAccount } from '@app/e2e/utils/setupMMFirstAccount';
import { registerRandomDomain } from '@app/zkSyncNameService/registerRandomDomain';
import { importNextAccount } from '@app/e2e/utils/importNextAccount';

const zkSyncNameServiceAction: ActivateZkAction = async ({ minion, recipient }) => {
  if (!hasBrowserInstance()) {
    await setupMMFistAccount({ seed: minion.mnemonic, chain: 'ZKSYNC' });
  }

  await registerRandomDomain();
  const { mm } = getBrowserInstance();

  if (recipient) {
    await importNextAccount({ mm, seed: recipient?.mnemonic });
  }

  return true;
};

export const activateMintsquareAccounts = async () => {
  await activateZkAccounts([zkSyncNameServiceAction], {
    skipPostAction: true,
    skipBalanceCheck: true
  });
};