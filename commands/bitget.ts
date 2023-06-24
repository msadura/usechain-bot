import '@app/init';
import { testBitget } from '@app/bitget/testBitget';

export async function action() {
  await testBitget();
}

action();
