import { getRandomWallets } from '@app/utils/getRandomWallets';

export const printAccountsWithSeeds = (numberOfAccounts: number, startNumber = 1) => {
  const accounts = getRandomWallets(numberOfAccounts);
  const accNumbers = Array.from({ length: numberOfAccounts }, (_, i) => i + startNumber);

  accounts.map((wallet, index) => {
    console.log(`Account: ${accNumbers[index]}`);
    console.log(wallet.address);
    console.log(wallet._mnemonic().phrase);
    console.log('');
  });
};
