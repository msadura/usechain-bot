import { getL1Provider, getL2Provider } from '@app/zkSync/provider';
import { Wallet } from 'zksync-web3';

export const getZkSyncSignerFromMnemonic = (mnemonic: string) => {
  const wallet = Wallet.fromMnemonic(mnemonic);

  return wallet.connect(getL2Provider()).connectToL1(getL1Provider());
};
