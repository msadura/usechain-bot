import { MinionAccount } from '@app/minions/minions';
import { Wallet } from 'ethers';

export type ActivateAction = (actionInput: {
  wallet: Wallet;
  minion: MinionAccount;
  recipient?: MinionAccount;
}) => Promise<boolean>;

export type PostAction = ({
  wallet,
  recipient,
  minion
}: {
  wallet: Wallet;
  recipient?: MinionAccount;
  minion: MinionAccount;
}) => Promise<void>;
