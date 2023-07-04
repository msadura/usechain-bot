import '@app/init';
import { testE2E } from '@app/e2e/testE2E';

export async function action() {
  await testE2E();
}

action();
