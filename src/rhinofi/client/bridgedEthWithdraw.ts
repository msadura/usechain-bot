import { Wallet, ethers } from 'ethers';
import { Wallet as ZkWallet } from 'zksync-web3';
import { RhinoClient } from '@app/rhinofi/client/getClient';
import { waitForBalanceUpdate } from '@app/utils/waitForBalanceUpdate';

export async function bridgedEthWithdraw({
  amount,
  chain,
  wallet,
  waitForFunds = true,
  rhinofi
}: {
  amount: string;
  chain: 'ZKSYNC';
  wallet?: Wallet | ZkWallet;
  waitForFunds?: boolean;
  rhinofi: RhinoClient;
}) {
  let balance = ethers.BigNumber.from(0);
  if (wallet && waitForFunds) {
    balance = await wallet.getBalance();
  }

  const res = await rhinofi.bridgedWithdraw({
    chain,
    amount,
    token: 'ETH'
  });

  if (wallet && waitForFunds) {
    await waitForBalanceUpdate({ wallet, initBalance: balance });
  }

  return res;
}
