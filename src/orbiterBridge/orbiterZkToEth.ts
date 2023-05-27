import { Wallet } from 'zksync-web3';
import BigNumber from 'bignumber.js';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import { getDigitByPrecision, getTransferAmount } from '@app/orbiterBridge/utils';
import { OrbitermakerConfig } from '@app/orbiterBridge/types';

export const makerConfig: OrbitermakerConfig = {
  id: '',
  makerId: '',
  ebcId: '',
  slippage: 280,
  makerAddress: '0x80C67432656d59144cEFf962E8fAF8926599bCF8',
  sender: '0x80C67432656d59144cEFf962E8fAF8926599bCF8',
  tradingFee: 0.006,
  gasFee: 1,
  fromChain: {
    id: 14,
    name: 'zkSync Era',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    minPrice: 0.005,
    maxPrice: 3
  },
  toChain: {
    id: 1,
    name: 'Ethereum',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18
  },
  times: [0, 99999999999999],
  crossAddress: {}
};

export async function orbiterZkToEth(wallet: Wallet) {
  const balanceL2 = await wallet.getBalance();

  if (balanceL2.lte(parseEther('0.07'))) {
    throw new Error('Not enough funds on L2 to bridge');
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

  console.log('🔥 max to bridge:', userMaxString);

  const transferRawAmount = getTransferAmount({ transferValue: userMaxString, makerConfig });
  const amount = new BigNumber(transferRawAmount).dividedBy(10 ** 18).toString();
  console.log('🔥 transfer amount with fees:', amount);

  console.log('🔥', 'sending L2 tx...');
  // send to bridge
  const tx = await wallet.transfer({
    to: makerConfig.makerAddress,
    amount: ethers.utils.parseEther(amount)
  });
  await tx.wait();

  await waitForL1Funds(wallet, userMaxString);
}

async function waitForL1Funds(wallet: Wallet, initBalance?: string): Promise<void> {
  console.log('🔥', 'Waiting for L1 funds...');
  const compareBalance = initBalance ? parseEther(initBalance) : await wallet.getBalanceL1();
  // TODO - throw if it takes too long

  return new Promise(resolve => {
    const interval = setInterval(async () => {
      const balance = await wallet.getBalanceL1();
      if (balance.gt(compareBalance)) {
        clearInterval(interval);
        console.log('🔥', 'L1 funds received!');
        resolve();
      }
    }, 5000);
  });
}
