import '@app/init';

import { activateZkBridgeAccounts } from '@app/zkSync/bridgeZkAction';

export async function action() {
  await activateZkBridgeAccounts();
}

action();
