import { Wallet, ethers } from 'ethers';
import { Wallet as ZkWallet } from 'zksync-web3';
import abi from '../abi/BridgeDepositContract.abi.json';
import { parseEther } from 'ethers/lib/utils';
import { waitForEthFunds } from '@app/rhinofi/client/waitForEthFunds';
import { RhinoClient } from '@app/rhinofi/client/getClient';

const contracts: Record<string, string> = {
  ZKSYNC: '0x1fa66e2B38d0cC496ec51F81c3e05E6A6708986F'
  // other chains if needed
};

export async function bridgedEthDeposit({
  amount,
  chain,
  wallet,
  waitForFunds = true,
  rhinofi
}: {
  amount: string;
  chain: 'ZKSYNC';
  wallet: Wallet | ZkWallet;
  waitForFunds?: boolean;
  rhinofi: RhinoClient;
}) {
  const contractAddress = contracts[chain];
  if (!contractAddress) {
    throw new Error(`No contract address to deposit rhinofi for chain ${chain}`);
  }

  const contract = new ethers.Contract(contractAddress, abi, wallet);
  const tx = await contract.depositNative({ value: parseEther(amount) });

  const receipt = await tx.wait();

  if (waitForFunds) {
    console.log('🔥', 'Deposit success, waiting for funds...');
    await waitForEthFunds({ rhinofi });
  }

  return receipt;
}
