import '@app/init';
import { recoverRhinoAccounts } from '@app/rhinofi/rhinoRecoverDtkAction';

export async function action() {
  await recoverRhinoAccounts();
}

action();
