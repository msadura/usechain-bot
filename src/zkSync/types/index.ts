import { MinionAccount } from '@app/minions/minions';
import { Wallet } from 'zksync-web3';

export type ActivateZkAction = (wallet: Wallet, recipient: string) => Promise<boolean>;
export type PostZkAction = ({
  wallet,
  recipient,
  minion
}: {
  wallet: Wallet;
  recipient: string;
  minion: MinionAccount;
}) => Promise<void>;
