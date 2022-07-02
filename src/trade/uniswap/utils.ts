import { BigNumber, Contract } from 'ethers';

export const getPoolImmutables = async (poolContract: Contract) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee()
  ]);

  return { token0, token1, fee };
};

export const getPoolState = async (poolContract: Contract) => {
  const slot = await poolContract.slot0();

  return { sqrtPriceX96: slot[0] };
};

export const isTokenApproved = async (params: {
  tokenContract: Contract;
  amount: BigNumber;
  spender: string;
  owner: string;
}) => {
  const allowance: BigNumber = await params.tokenContract.allowance(params.owner, params.spender);

  return allowance.gte(BigNumber.from(params.amount));
};
