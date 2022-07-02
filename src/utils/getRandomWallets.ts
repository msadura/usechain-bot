import { ethers } from 'ethers';

export const getRandomWallets = (numberOfAccounts: number) => {
  return Array(numberOfAccounts)
    .fill(true)
    .map(() => ethers.Wallet.createRandom());
};
