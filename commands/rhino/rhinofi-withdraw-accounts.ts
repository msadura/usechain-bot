import '@app/init';

import { rhinoWithdrawAccountsAction } from '@app/rhinofi/rhinoWithdrawFundAction';

export async function action() {
  await rhinoWithdrawAccountsAction();
}

action();
