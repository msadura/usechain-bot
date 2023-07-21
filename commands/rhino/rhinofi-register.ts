import '@app/init';
import { registerRhinoAccounts } from '@app/rhinofi/rhinoRegisterAction';

export async function action() {
  await registerRhinoAccounts();
}

action();
