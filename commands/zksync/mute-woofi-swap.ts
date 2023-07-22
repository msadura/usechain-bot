import '@app/init';

import { activateMuteWoofiSwapZkSync } from '@app/zkSync/muteWoofiSwapAction';

export async function action() {
  await activateMuteWoofiSwapZkSync();
}

action();
