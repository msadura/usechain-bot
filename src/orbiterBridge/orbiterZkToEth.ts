import { Wallet } from 'zksync-web3';
import BigNumber from 'bignumber.js';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';

export const makerConfig = {
  gasFee: 0.8,
  tradingFee: 0.0072,
  slippage: 280,
  makerAddress: '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8',
  sender: '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8',
  maxPrice: 3,
  minPrice: 0.005,
  startTime: 0,
  endTime: 99999999999999,
  fromChain: {
    decimals: 18,
    id: 14,
    maxPrice: 3,
    minPrice: 0.005,
    name: 'zkSync Era',
    symbol: 'ETH',
    tokenAddress: '0x0000000000000000000000000000000000000000'
  },
  toChain: {
    decimals: 18,
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    tokenAddress: '0x0000000000000000000000000000000000000000'
  }
};

export async function orbiterZkToEth(wallet: Wallet) {
  const balanceL2 = await wallet.getBalance();

  if (balanceL2.lte(parseEther('0.07'))) {
    throw new Error('Not enough funds on L2 to bridge');
  }

  const gasPrice = await wallet.provider.getGasPrice();
  const estimatedGas = await wallet.provider.estimateGas({
    to: makerConfig.makerAddress,
    from: wallet.address
  });

  const finalEstimatedGas = new BigNumber(estimatedGas.toString()).multipliedBy(1.5);
  const gas = new BigNumber(gasPrice.toString()).multipliedBy(finalEstimatedGas);
  const gasFee = gas.dividedBy(10 ** 18).toString();

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

  console.log('🔥 max to bridge:', userMaxString);

  const transferRawAmount = getTransferAmount({ transferValue: userMaxString });
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

function getTransferAmount({ transferValue }: { transferValue: string }) {
  const rAmount = new BigNumber(transferValue)
    .plus(new BigNumber(makerConfig.tradingFee))
    .multipliedBy(new BigNumber(10 ** makerConfig.fromChain.decimals));
  const rAmountValue = rAmount.toFixed();
  const amountLength = rAmountValue.toString().length;
  // This is important for bridge to recognize target chain
  const pText = 9000 + Number(1) + '';

  const tAmount = rAmountValue.toString().slice(0, amountLength - pText.length) + pText;

  return tAmount;
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
