import '@app/init';
import { rhinoFundAccountsAction } from '@app/rhinofi/rhinoFundAccountsAction';

export async function action() {
  await rhinoFundAccountsAction();
}

action();
