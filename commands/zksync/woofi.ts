import '@app/init';

import { woofiTest } from '@app/woofi/woofiTest';

export async function action() {
  await woofiTest();
}

action();
