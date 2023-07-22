import '@app/init';
import { muteTest } from '@app/muteswitch/testSyncSwap';

import { activateSyncSwapAccounts } from '@app/syncswap/syncSwapAction';

export async function action() {
  await muteTest();
}

action();
