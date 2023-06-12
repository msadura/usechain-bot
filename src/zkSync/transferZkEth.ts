import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils';
import { Wallet } from 'zksync-web3';

export async function transferZkEth({
  wallet,
  recipient,
  minAccountBalance = '0'
}: {
  wallet: Wallet;
  recipient: string;
  minAccountBalance: string;
}) {
  const balance = await wallet.getBalance();
  const estimatedGas = await wallet.provider.estimateGas({
    to: recipient,
    value: balance,
    from: wallet.address
  });
  const gasPrice = await wallet.provider.getGasPrice();
  const gasValue = estimatedGas.mul(gasPrice);

  console.log('🔥 transfer gas:', formatEther(estimatedGas));
  console.log('🔥 gas price:', formatUnits(gasPrice, 'gwei'));
  console.log('🔥 gas value:', formatEther(gasValue));

  const balanceOut = balance.sub(gasValue).sub(parseEther(minAccountBalance));
  console.log('💰 transfering balance out:', formatEther(balanceOut));

  if (recipient) {
    // transfering l2 eth
    const transferTx = await wallet.sendTransaction({
      to: recipient,
      value: balanceOut,
      gasLimit: estimatedGas
    });
    await transferTx.wait();
  }

  return balanceOut;
}
