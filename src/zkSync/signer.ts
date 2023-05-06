import { getL1Provider, getL2Provider } from '@app/zkSync/provider';
import { Wallet } from 'zksync-web3';

export const getZkSyncSignerFromMnemonic = (mnemonic: string) => {
  const wallet = Wallet.fromMnemonic(mnemonic);

  return new Wallet(wallet.privateKey, getL2Provider(), getL1Provider());
};
