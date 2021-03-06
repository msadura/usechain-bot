import { SEND_GAS_LIMIT } from '@app/constants';
import { getGasValue } from '@app/utils/getGasValue';
import { Wallet } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export const transferEthFromWallet = async (signer: Wallet, recipient: string) => {
  const balance = await signer.getBalance();
  const { gasValue, gasPrice, gasLimit } = await getGasValue(SEND_GAS_LIMIT);
  const balanceOut = balance.sub(gasValue);

  if (balanceOut.lte(0)) {
    throw 'No balance to send to next account';
  }

  const tx = await signer.sendTransaction({
    to: recipient,
    value: balanceOut,
    gasPrice,
    gasLimit
  });

  await tx.wait();

  console.log('🔥', `Transferred ${formatEther(balanceOut)} to walet ${recipient}`);

  return balanceOut;
};
