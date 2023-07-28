import '@app/init';
import { bridgeZkWithBitget } from '@app/zkSync/bridgeWithBitgetAction';

export async function action() {
  await bridgeZkWithBitget();
}

action();
