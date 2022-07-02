import { BigNumber, Contract } from 'ethers';

export const isTokenApproved = async (params: {
  tokenContract: Contract;
  amount: BigNumber;
  spender: string;
  owner: string;
}) => {
  const allowance: BigNumber = await params.tokenContract.allowance(params.owner, params.spender);

  return allowance.gte(BigNumber.from(params.amount));
};
