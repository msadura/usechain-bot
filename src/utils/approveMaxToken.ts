import { isTokenApproved } from '@app/trade/utils';
import { BigNumber, Wallet, ethers } from 'ethers';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { MAX_APPROVE_AMOUNT } from '@app/constants';

export async function approveMaxToken({
  tokenAddress,
  amountIn,
  signer,
  spenderAddress
}: {
  tokenAddress: string;
  amountIn: BigNumber;
  signer: Wallet;
  spenderAddress: string;
}) {
  if (tokenAddress === ethers.constants.AddressZero) {
    console.log('ℹ️', 'Gas asset does not need approval');
    return;
  }

  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);

  const isApproved = await isTokenApproved({
    tokenContract,
    amount: amountIn,
    spender: spenderAddress,
    owner: signer.address
  });

  if (!isApproved) {
    console.log('ℹ️', 'Approving token');
    const approvalTx = await tokenContract.approve(spenderAddress, MAX_APPROVE_AMOUNT);
    await approvalTx.wait();
  }
}
