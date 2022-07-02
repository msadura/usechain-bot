import { Wallet } from 'ethers';

export type ActivateAction = (signer: Wallet) => Promise<boolean>;
