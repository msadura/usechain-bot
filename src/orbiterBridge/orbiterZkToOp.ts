import { Wallet } from 'zksync-web3';
import { Wallet as EthersWallet } from 'ethers';
import { OrbitermakerConfig } from '@app/orbiterBridge/types';
import { orbiterBridgeFromZk } from '@app/orbiterBridge/orbiterBridgeFromZk';
import { waitForBalanceUpdate } from '@app/utils/waitForBalanceUpdate';

export const makerConfig: OrbitermakerConfig = {
  id: '',
  makerId: '',
  ebcId: '',
  slippage: 0,
  makerAddress: '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8',
  sender: '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8',
  tradingFee: 0.0017,
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
    id: 7,
    name: 'Optimism',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18
  },
  times: [0, 99999999999999],
  crossAddress: {}
};

export async function orbiterZkToOp({ wallet, amountIn }: { wallet: Wallet; amountIn?: string }) {
  await orbiterBridgeFromZk({ wallet, makerConfig, amountIn });
}

export async function waitForOpFunds(wallet: EthersWallet): Promise<void> {
  console.log('🔥', 'Waiting for OP funds...');

  await waitForBalanceUpdate({ wallet });
}
