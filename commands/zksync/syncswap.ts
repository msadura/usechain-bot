import '@app/init';

import { activateSyncSwapAccounts } from '@app/syncswap/syncSwapAction';

export async function action() {
  await activateSyncSwapAccounts();
}

action();
