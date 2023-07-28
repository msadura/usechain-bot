import { getAddressForId } from '@app/bitget/depositBook/getAddressForId';
import { waitForDeposit } from '@app/bitget/waitForDeposit';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { MinionAccount } from '@app/minions/minions';
import { transferEthFromWallet } from '@app/utils/transferEthFromWallet';
import { ethers } from 'ethers';

export async function depositFundsFromMinion({
  minion,
  chain = 'eth',
  minAccountBalance
}: {
  minion: MinionAccount;
  chain?: ethers.providers.Networkish;
  minAccountBalance?: string;
}) {
  const wallet = getSignerFromMnemonic(minion.mnemonic, chain);
  const recipient = getAddressForId(minion.id);

  await transferEthFromWallet(wallet, recipient, { minAccountBalance });
  await waitForDeposit();
}
