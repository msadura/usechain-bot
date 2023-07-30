import { BigNumber, Contract, ethers } from 'ethers';

type Params = {
  data?: string;
  provider: ethers.providers.Provider;
};

export async function getTxAdditionalGasFee({ data, provider }: Params) {
  const { chainId } = await provider.getNetwork();

  // Op additional fee
  if (chainId === 10) {
    return getOpGasFee({ data, provider });
  }

  return ethers.BigNumber.from(0);
}

const opOracleAbi = [`function getL1Fee(bytes data) external view returns (uint256 fee)`];

async function getOpGasFee({ data, provider }: Params) {
  const oracleContract = new Contract(
    '0x420000000000000000000000000000000000000F',
    opOracleAbi,
    provider
  );

  const fee: BigNumber = await oracleContract.getL1Fee(data || ethers.constants.HashZero);
  const totalFee = fee.mul(ethers.BigNumber.from(2));

  return totalFee;
}
