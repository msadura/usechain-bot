import { Wallet } from 'ethers';

export type ActivateAction = (signer: Wallet, recipient: string) => Promise<boolean>;
