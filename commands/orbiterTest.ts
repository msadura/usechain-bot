import '@app/init';
import { testOrbiter } from '@app/orbiterBridge/testOrbiter';

export async function action() {
  await testOrbiter();
}

action();
