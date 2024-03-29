import { MinionAccount } from '@app/minions/minions';
import { Wallet } from 'zksync-web3';

export type ActivateZkAction = ({
  wallet,
  recipient,
  minion
}: {
  wallet: Wallet;
  minion: MinionAccount;
  recipient?: MinionAccount;
}) => Promise<boolean>;

export type PostZkAction = ({
  wallet,
  recipient,
  minion
}: {
  wallet: Wallet;
  recipient?: MinionAccount;
  minion: MinionAccount;
}) => Promise<void>;
