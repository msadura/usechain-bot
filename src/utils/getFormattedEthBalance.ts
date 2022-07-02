import { BigNumber, Wallet } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export const getFormattedEthBalance = async (signer: Wallet, throwIfEmpty = false) => {
  const balanceIn = await signer.getBalance();

  if (balanceIn.eq(BigNumber.from('0')) && throwIfEmpty) {
    throw `Empty balance on account ${signer.address}. Stopping for safety purposes`;
  }

  return formatEther(balanceIn);
};
