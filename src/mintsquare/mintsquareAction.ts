import { activateZkAccounts } from '@app/zkSync/activateZkAccounts';
import { ActivateZkAction } from '@app/zkSync/types';
import { Wallet } from 'zksync-web3';

import { mint } from '@app/mintsquare/mint';

const syncSwapAction: ActivateZkAction = async (wallet: Wallet) => {
  await mint({ wallet });

  return true;
};

export const activateMintsquareAccounts = async () => {
  await activateZkAccounts([syncSwapAction], {
    skipPostAction: true,
    skipBalanceCheck: true
  });
};
