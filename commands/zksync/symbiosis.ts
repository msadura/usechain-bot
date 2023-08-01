import '@app/init';
import { symbiosisTest } from '@app/symbiosis/symbiosisTest';

export async function action() {
  await symbiosisTest();
}

action();
