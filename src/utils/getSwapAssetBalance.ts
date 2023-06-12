import { TradeAsset } from '@app/types';
import { BigNumber, Wallet, ethers } from 'ethers';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { formatUnits } from 'ethers/lib/utils';

export async function getSwapAssetBalance({
  assetIn,
  signer,
  wethAddress
}: {
  assetIn: TradeAsset;
  signer: Wallet;
  wethAddress: string;
}) {
  const isETHIn = assetIn.address === wethAddress;

  const tokenInContract = new ethers.Contract(assetIn.address, ERC20ABI, signer);

  const inBalancePromise: Promise<BigNumber> = isETHIn
    ? signer.getBalance()
    : tokenInContract.balanceOf(signer.address);
  const inBalance: BigNumber = await inBalancePromise;

  console.log(`🔥 ${assetIn.name} balance: `, formatUnits(inBalance, assetIn.decimals));

  return inBalance;
}
