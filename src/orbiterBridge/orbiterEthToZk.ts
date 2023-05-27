import { Wallet } from 'zksync-web3';
import BigNumber from 'bignumber.js';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import { getDigitByPrecision, getTransferAmount } from '@app/orbiterBridge/utils';
import { waitForZkFunds } from '@app/zkSync/waitForL2Funds';

export const makerConfig = {
  id: '',
  makerId: '',
  ebcId: '',
  slippage: 0,
  makerAddress: '0xee73323912a4e3772B74eD0ca1595a152b0ef282',
  sender: '0xee73323912a4e3772B74eD0ca1595a152b0ef282',
  tradingFee: 0.0021,
  gasFee: 0.2,
  fromChain: {
    id: 1,
    name: 'Ethereum',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    minPrice: 0.005,
    maxPrice: 10
  },
  toChain: {
    id: 14,
    name: 'zkSync Era',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18
  },
  times: [0, 99999999999999],
  crossAddress: {}
};

export async function orbiterEthToZk(wallet: Wallet, sendAmount?: string) {
  if (!wallet.providerL1) {
    throw new Error('No provider for L1');
  }

  const { fromChain } = makerConfig;

  const balanceL1 = await wallet.getBalanceL1();
  const balanceL2 = await wallet.getBalance();
  const gasPrice = await wallet.providerL1.getGasPrice();
  const estimatedGas = await wallet.providerL1.estimateGas({
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
  console.log('🔥 gas fee:', gasFee);

  // conditions from orbiter
  const avalibleDigit = getDigitByPrecision(fromChain.decimals);
  const opBalance = 10 ** -avalibleDigit;
  let preGas = 0;
  const preGasDigit = 3;
  if ([3, 33, 1, 5, 2, 22, 7, 77, 16, 516].includes(fromChain.id)) {
    preGas = 10 ** -preGasDigit;
  }

  // gas and fee calculations from orbiter
  const userBalance = new BigNumber(formatEther(balanceL1.toString()))
    .minus(new BigNumber(makerConfig.tradingFee))
    .minus(new BigNumber(opBalance))
    .minus(new BigNumber(gasFee))
    .minus(new BigNumber(preGas));

  const userMax = userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN).isGreaterThan(0)
    ? userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
    : new BigNumber(0);

  // formatted eth value
  const userMaxString = sendAmount || userMax.toString();

  console.log('🔥 max to bridge:', userMaxString);

  const transferRawAmount = getTransferAmount({ transferValue: userMaxString, makerConfig });
  const amount = new BigNumber(transferRawAmount).dividedBy(10 ** 18).toString();
  console.log('🔥 transfer amount with fees:', amount);

  console.log('🔥', 'sending L1 tx...');
  // send to bridge
  const l1Wallet = wallet.ethWallet();
  const tx = await l1Wallet.sendTransaction({
    from: l1Wallet.address,
    to: makerConfig.makerAddress,
    value: ethers.utils.parseEther(amount),
    // transfer gas limit for ETH mainnet is  always 21000
    gasLimit: 21000
  });
  await tx.wait();

  await waitForZkFunds(wallet, formatEther(balanceL2));
}
