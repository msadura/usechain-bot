import { RhinoClient } from '@app/rhinofi/client/getClient';
import { Wallet } from 'ethers';

export async function register(rhinofi: RhinoClient, wallet: Wallet) {
  const starkPrivKey = wallet.privateKey.replace(/^0x/, '');
  const keyPair = await rhinofi.stark.createKeyPair(starkPrivKey);

  try {
    await rhinofi.register(keyPair.starkPublicKey);
    return true;
  } catch (e: any) {
    if (e.error.error === 'USER_ALREADY_REGISTERED') {
      console.log('🔥 Rhinofi account already registered', wallet.address);
      return true;
    }

    throw e;
  }
}
