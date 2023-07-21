import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getRhinoClient } from '@app/rhinofi/client/getClient';

export function getFundingClient() {
  const FUNDING_ACCOUNT_MNEMONIC = process.env.FUNDING_ACCOUNT_MNEMONIC;
  if (!FUNDING_ACCOUNT_MNEMONIC) {
    throw new Error('FUNDING_ACCOUNT_MNEMONIC is not set');
  }

  const wallet = getSignerFromMnemonic(FUNDING_ACCOUNT_MNEMONIC);

  return getRhinoClient(wallet.privateKey);
}
