import { makerConfig } from '@app/orbiterBridge/constants';
import { Wallet } from 'zksync-web3';
import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/lib/utils';

export async function orbiterZkToEth(wallet: Wallet) {
  const balanceL2 = await wallet.getBalance();
  const gasPrice = await wallet.provider.getGasPrice();
  const estimatedGas = await wallet.provider.estimateGas({
    to: makerConfig.makerAddress,
    from: wallet.address
  });

  const finalEstimatedGas = new BigNumber(estimatedGas.toString()).multipliedBy(1.5);
  const gas = new BigNumber(gasPrice.toString()).multipliedBy(finalEstimatedGas);
  const gasFee = gas.dividedBy(10 ** 18).toString();

  // console.log('🔥 gasFee', gasFee);
  // console.log('🔥 gasPrice', gasPrice.toString());
  // console.log('🔥 estimatedGas', finalEstimatedGas.toString());

  const avalibleDigit = 6;
  const opBalance = 10 ** -avalibleDigit;
  const preGas = 0;

  // gas and fee calculations from orbiter
  const userBalance = new BigNumber(formatEther(balanceL2.toString()))
    .minus(new BigNumber(makerConfig.tradingFee))
    .minus(new BigNumber(opBalance))
    .minus(new BigNumber(gasFee))
    .minus(new BigNumber(preGas));

  const userMax = userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN).isGreaterThan(0)
    ? userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
    : new BigNumber(0);

  // formatted eth value
  const userMaxString = userMax.toString();

  console.log('🔥max to send:', userMaxString);

  // send to bridge
}
