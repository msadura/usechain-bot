import '@app/init';
import { testRhino } from '@app/rhinofi/testRhino';

export async function action() {
  await testRhino();
}

action();
