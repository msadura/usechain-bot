import '@app/init';

import { testRhinoClient } from '@app/rhinofi/testRhinoClient';

export async function action() {
  await testRhinoClient();
}

action();
