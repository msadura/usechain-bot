import { SEND_GAS_LIMIT } from '@app/constants';
import { getGasValue } from '@app/utils/getGasValue';
import { BigNumber, Wallet } from 'ethers';
import { formatEther, parseUnits } from 'ethers/lib/utils';

type SendConfig = {
  gasLimit?: number;
  minGasPrice?: number;
  nonce?: number;
};

export const transferEthFromWallet = async (
  signer: Wallet,
  recipient: string,
  sendConfig?: SendConfig
) => {
  const balance = await signer.getBalance();
  const sendGasLimit = sendConfig?.gasLimit || SEND_GAS_LIMIT;

  const { gasValue, gasPrice, gasLimit } = await getGasValue({
    gasLimit: sendGasLimit,
    provider: signer.provider
  });
  if (!gasValue) {
    throw 'Could not get gas value for transfer';
  }

  const gasPriceToUse = gasPrice;
  // const minGasPrice = sendConfig?.minGasPrice
  //   ? parseUnits(String(sendConfig.minGasPrice), 'gwei')
  //   : null;
  // console.log('🔥 minGasPrice:', sendConfig?.minGasPrice || '-');

  // if (gasPrice && minGasPrice && gasPrice.lt(minGasPrice)) {
  //   console.log('🔥 using min gas price:', minGasPrice);
  //   gasPriceToUse = minGasPrice;
  // }

  const balanceOut = balance.sub(gasValue);

  if (balanceOut.lte(0)) {
    throw 'No balance to send to next account';
  }

  const tx = await signer.sendTransaction({
    to: recipient,
    value: balanceOut,
    gasPrice: gasPriceToUse,
    nonce: sendConfig?.nonce,
    gasLimit
  });

  await tx.wait();

  console.log('🔥', `Transferred ${formatEther(balanceOut)} to walet ${recipient}`);

  return balanceOut;
};
