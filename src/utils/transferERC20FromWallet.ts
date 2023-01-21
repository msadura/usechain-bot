import { TradeAsset } from '@app/types';

import { Contract, Wallet } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

type Config = {
  recipient: string;
  asset: TradeAsset;
  assetContract: Contract;
  signer: Wallet;
};

export const transferERC20FromWallet = async ({
  signer,
  recipient,
  asset,
  assetContract
}: Config) => {
  const balanceOut = await assetContract.balanceOf(signer.address);
  if (balanceOut.lte(0)) {
    console.log('🔥', 'No balance to send to next account');
    return;
  }

  const tx = await assetContract.transfer(recipient, balanceOut);

  await tx.wait();

  console.log(
    '🔥',
    `Transferred ${formatUnits(balanceOut, asset.decimals)} ${asset.name} to walet ${recipient}`
  );

  return balanceOut;
};
