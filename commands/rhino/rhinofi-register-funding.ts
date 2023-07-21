import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import '@app/init';
import { registerAccount } from '@app/rhinofi/utils/registerAccount';

export async function action() {
  const FUNDING_ACCOUNT_MNEMONIC = process.env.FUNDING_ACCOUNT_MNEMONIC;
  if (!FUNDING_ACCOUNT_MNEMONIC) {
    throw new Error('FUNDING_ACCOUNT_MNEMONIC is not set');
  }

  const wallet = getSignerFromMnemonic(FUNDING_ACCOUNT_MNEMONIC);

  await registerAccount({ wallet });

  console.log('🔥', 'Funding account registered.', wallet.address);
}

action();
