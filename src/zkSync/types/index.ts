import { MinionAccount } from '@app/minions/minions';
import { Wallet } from 'zksync-web3';

export type ActivateZkAction = (wallet: Wallet, recipient: string) => Promise<boolean>;
export type PostZkAction = ({
  wallet,
  recipient,
  minion,
  minionsFilename
}: {
  wallet: Wallet;
  recipient: string;
  minion: MinionAccount;
  minionsFilename: string;
}) => Promise<void>;
