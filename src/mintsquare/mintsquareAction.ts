import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { ActivateZkAction } from '@app/zkSync/types';

import { mint } from '@app/mintsquare/mint';
import { wait } from '@app/utils/wait';

const syncSwapAction: ActivateZkAction = async ({ wallet }) => {
  await mint({ wallet });
  await wait(30000);

  return true;
};

export const activateMintsquareAccounts = async () => {
  await activateZkAccounts([syncSwapAction], {
    skipPostAction: true,
    skipBalanceCheck: true
  });
};
