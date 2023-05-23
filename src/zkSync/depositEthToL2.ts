import { parseEther } from 'ethers/lib/utils';
import { Wallet, utils } from 'zksync-web3';

export async function depositEthToL2(wallet: Wallet, amount: string) {
  console.log('🔥', 'Depositing ETH to L2...');

  const tx = await wallet.deposit({
    token: utils.ETH_ADDRESS,
    amount: parseEther(amount)
  });

  console.log('🔥', 'ETH deposit transaction submitted:', tx.hash);
  console.log('🔥', 'Waiting for confirmation on L2...');
  await tx.wait();

  console.log('🔥', 'ETH deposit transaction completed:', tx.hash);
}
