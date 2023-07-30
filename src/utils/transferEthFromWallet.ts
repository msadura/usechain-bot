import { getTxAdditionalGasFee } from '@app/utils/getChainAdditionalGasFee';
import { getGasValue } from '@app/utils/getGasValue';
import { getSendGasLimit } from '@app/utils/getSendGasLimit';
import { Wallet } from 'ethers';
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils';

type SendConfig = {
  gasLimit?: number;
  minGasPrice?: number;
  nonce?: number;
  minAccountBalance?: string;
};

export const transferEthFromWallet = async (
  signer: Wallet,
  recipient: string,
  sendConfig?: SendConfig
) => {
  const balance = await signer.getBalance();
  const network = await signer.provider.getNetwork();
  const estimatedGas = await signer.provider.estimateGas({
    to: recipient,
    from: signer.address
  });

  const sendGasLimit = sendConfig?.gasLimit || estimatedGas || getSendGasLimit(network.chainId);

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

  const additionalFee = await getTxAdditionalGasFee({ provider: signer.provider });
  const minBalance = parseEther(sendConfig?.minAccountBalance || '0');
  const balanceOut = balance.sub(gasValue).sub(minBalance).sub(additionalFee);

  console.log('🔥fees:', formatEther(gasValue.add(additionalFee)));

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
