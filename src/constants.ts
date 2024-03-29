import { NetworkType } from '@app/types';
import { ethers } from 'ethers';

const safeEnv = (defaultEnv: string | undefined, env?: string) => {
  return env || defaultEnv;
};

export const RPC_URL = process.env.RPC_URL as string;
export const NETWORK_TYPE = safeEnv(process.env.NETWORK_TYPE, 'testnet') as NetworkType;
export const WSS_RPC_URL = process.env.WSS_RPC_URL as string;
export const MNEMONIC = process.env.MNEMONIC as string;

// todo: set filename per chain / action
export const MINIONS_FILE_NAME = process.env.MINIONS_FILE_NAME as string;
export const MAX_GAS_PRICE = 0;
export const GAS_WAIT_TIME = 10000;
export const MIN_WALLET_BALANCE = '0.005';
export const SEND_GAS_LIMIT = 600000; // 21k for ETH mainnet, 499k for argitrum, 21k FTM

export const MAX_APPROVE_AMOUNT = ethers.constants.MaxUint256;
export const ZERO_ADDRESS = ethers.constants.AddressZero;

export const SEND_GAS_LIMITS: Record<string, number> = {
  eth: 21000,
  zkSync: 600000
};

export const CHAIN_ID_TO_SYMBOL: Record<number, string> = {
  1: 'eth',
  10: 'op',
  324: 'zkSync'
};
