import { transferERC20FromWallet } from '@app/utils/transferERC20FromWallet';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getMinions } from '@app/minions/minions';

import { USDC } from '@app/fantom/epsylon/constants';
import { Contract } from 'ethers';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';

export const sendUSDCFromMinion = async (minionId: number, recipient: string) => {
  const minions = getMinions();
  const minion = minions.find(m => m.id === minionId);

  if (!minion) {
    throw `Cannot find minion with id ${minionId}. Cnnot send funds`;
  }

  const signer = getSignerFromMnemonic(minion.mnemonic);
  const asset = USDC;
  const assetContract = new Contract(asset.address, ERC20ABI, signer);

  await transferERC20FromWallet({ signer, recipient, asset, assetContract });
};
