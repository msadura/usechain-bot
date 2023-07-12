import '@app/init';

import { activateZkNSAccounts } from '@app/zkSyncNameService/zkSyncNameServiceAction';

export async function action() {
  await activateZkNSAccounts();
}

action();
