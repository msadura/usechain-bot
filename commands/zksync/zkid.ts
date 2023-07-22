import '@app/init';
import { testZkSyncId } from '@app/zkSyncId/testZkSyncId';

export async function action() {
  await testZkSyncId();
}

action();
