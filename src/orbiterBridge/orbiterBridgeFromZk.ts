import { Wallet } from 'zksync-web3';
import BigNumber from 'bignumber.js';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { getDigitByPrecision, getTransferAmount } from '@app/orbiterBridge/utils';
import { OrbitermakerConfig } from '@app/orbiterBridge/types';
import { ethers } from 'ethers';

export async function orbiterBridgeFromZk({
  wallet,
  makerConfig,
  amountIn
}: {
  wallet: Wallet;
  makerConfig: OrbitermakerConfig;
  amountIn?: string;
}) {
  if (makerConfig.fromChain.id !== 14) {
    throw new Error('From chain should be 14 (zkSync era internal orbiter id)');
  }

  const balanceL2 = await wallet.getBalance();

  if (
    balanceL2.lte(parseEther('0.07')) ||
    (amountIn && balanceL2.lte(parseEther(amountIn || '0.07')))
  ) {
    // throw new Error('Not enough funds on L2 to bridge');
  }

  const { fromChain } = makerConfig;

  const gasPrice = await wallet.provider.getGasPrice();
  const estimatedGas = await wallet.provider.estimateGas({
    to: makerConfig.makerAddress,
    from: wallet.address
  });

  let finalEstimatedGas = new BigNumber(estimatedGas.toString());
  // conditions from orbiter
  if (fromChain.id === 14 || fromChain.id === 514) {
    finalEstimatedGas = new BigNumber(estimatedGas.toString()).multipliedBy(1.5);
  }
  const gas = new BigNumber(gasPrice.toString()).multipliedBy(finalEstimatedGas);
  const gasFee = gas.dividedBy(10 ** 18).toString();

  // conditions from orbiter
  const avalibleDigit = getDigitByPrecision(fromChain.decimals);
  const opBalance = 10 ** -avalibleDigit;
  let preGas = 0;
  const preGasDigit = 3;
  if ([3, 33, 1, 5, 2, 22, 7, 77, 16, 516].includes(fromChain.id)) {
    preGas = 10 ** -preGasDigit;
  }

  // gas and fee calculations from orbiter
  const userBalance = new BigNumber(amountIn || formatEther(balanceL2.toString()))
    .minus(new BigNumber(makerConfig.tradingFee))
    .minus(new BigNumber(opBalance))
    .minus(new BigNumber(gasFee))
    .minus(new BigNumber(preGas));

  const userMax = userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN).isGreaterThan(0)
    ? userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
    : new BigNumber(0);

  // formatted eth value
  const userMaxString = userMax.toString();
  console.log('🔥 ZK balance:', formatEther(balanceL2));
  console.log('🔥 max to bridge:', userMaxString);

  const transferRawAmount = getTransferAmount({ transferValue: userMaxString, makerConfig });
  const amount = new BigNumber(transferRawAmount).dividedBy(10 ** 18).toString();
  console.log('🔥 transfer amount with fees:', amount);

  console.log('🔥', 'sending ZK tx...');
  // send to bridge
  const tx = await wallet.transfer({
    to: makerConfig.makerAddress,
    amount: ethers.utils.parseEther(amount)
  });

  await tx.wait();

  return {
    userMaxString,
    userMax
  };
}
