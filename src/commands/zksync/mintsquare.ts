import '../../init';
import { activateMintsquareAccounts } from '@app/mintsquare/mintsquareAction';

export async function action() {
  await activateMintsquareAccounts();
}

action();
