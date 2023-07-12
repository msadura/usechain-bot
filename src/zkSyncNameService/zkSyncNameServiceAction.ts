import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { ActivateZkAction } from '@app/zkSync/types';

import { mint } from '@app/mintsquare/mint';
import { wait } from '@app/utils/wait';
import { hasBrowserInstance } from '@app/e2e/browserInstance';

const zkSyncNameServiceAction: ActivateZkAction = async ({ wallet }) => {
  if (!hasBrowserInstance) {
  }
  await mint({ wallet });
  await wait(30000);

  return true;
};

export const activateMintsquareAccounts = async () => {
  await activateZkAccounts([zkSyncNameServiceAction], {
    skipPostAction: true,
    skipBalanceCheck: true
  });
};
