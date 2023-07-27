import { Wallet } from 'zksync-web3';
import { parseEther } from 'ethers/lib/utils';
import { OrbitermakerConfig } from '@app/orbiterBridge/types';
import { orbiterBridgeFromZk } from '@app/orbiterBridge/orbiterBridgeFromZk';

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
  const { userMaxString } = await orbiterBridgeFromZk({ wallet, makerConfig });

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
