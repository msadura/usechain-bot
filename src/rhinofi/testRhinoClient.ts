import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getMinions } from '@app/minions/minions';
import { getRhinoClient } from '@app/rhinofi/client/getClient';
import { register } from '@app/rhinofi/client/register';

export async function testRhinoClient() {
  const minions = getMinions();
  const signer = getSignerFromMnemonic(minions[1].mnemonic);

  const rhinofi = await getRhinoClient(signer.privateKey);

  // const res = await register(rhinofi, signer);

  console.log('🔥rf', rhinofi);
}
