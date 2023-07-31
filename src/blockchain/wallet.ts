import { getProvider } from '@app/blockchain/provider';
import { MNEMONIC } from '@app/constants';
import { ethers } from 'ethers';

let httpWallet: ethers.Wallet;

export async function connectWallet(): Promise<void> {
  if (!MNEMONIC) {
    throw 'Mnemonic not set. Cannot connect wallet.';
  }

  const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);

  console.info('🔥', 'Connecting wallet...');

  try {
    const httpProvider = getProvider();
    httpWallet = httpProvider && wallet.connect(httpProvider);
  } catch (e) {
    console.log('🔥 Wallet connect error', e);
  }

  console.log('🔥', `Wallet connected: ${httpWallet.address}`);
}

export function getWallet(): ethers.Wallet {
  if (httpWallet) {
    return httpWallet;
  }

  throw 'Incorrect wallet connection type or accoount not connected';
}

export function getSignerFromMnemonic(mnemonic: string, chain: ethers.providers.Networkish = 1) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const provider = getProvider(chain);

  return provider && wallet.connect(provider);
}
