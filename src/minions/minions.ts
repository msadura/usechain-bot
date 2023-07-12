import { MINIONS_FILE_NAME } from './../constants';
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

const addressBookFile = path.join(__dirname, `${MINIONS_FILE_NAME}.json`);

function getAddressBookFile(name: string) {
  return path.join(__dirname, `${name}.json`);
}

export type MinionAccount = {
  id: number;
  address: string;
  mnemonic: string;
  done?: boolean;
  amountIn?: string;
  amountOut?: string;
  totalFee?: string;
};

export function generateMinions(numberOfMinions = 1, filename = MINIONS_FILE_NAME) {
  const currentMinions = getMinions(filename);

  const numToGenerate = numberOfMinions - currentMinions.length;

  if (numToGenerate < 1) {
    return;
  }

  try {
    console.log('🔥', `Generating ${numToGenerate} minions`);
    const generatedAccounts = Array.from(Array(numToGenerate).keys()).map((_, idx) =>
      generateAccount(idx + currentMinions.length)
    );

    const updatedMinions = [...currentMinions, ...generatedAccounts];

    saveMinions(updatedMinions);
    console.log('🔥', `Total minions: ${numberOfMinions} - saved to ${MINIONS_FILE_NAME}.json`);
  } catch (e) {
    console.log('🔥', e);
  }
}

function generateAccount(id: number): MinionAccount {
  const wallet = ethers.Wallet.createRandom();

  return {
    id,
    address: wallet.address,
    mnemonic: wallet.mnemonic.phrase
  };
}

export const getMinions = (filename = MINIONS_FILE_NAME) => {
  try {
    const content = fs.readFileSync(getAddressBookFile(filename), 'utf8');
    const minions = content ? (JSON.parse(content) as MinionAccount[]) : [];

    return minions;
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }

    return [];
  }
};

export const updateMinion = (minion: MinionAccount, minionsFilename = MINIONS_FILE_NAME) => {
  const currentMinions = getMinions(minionsFilename);
  const index = currentMinions.findIndex(m => m.id === minion.id);
  if (index < 0) {
    return;
  }

  const updatedMinions = [...currentMinions];
  updatedMinions[index] = minion;

  saveMinions(updatedMinions);
};

export const saveMinions = (minionsData: MinionAccount[]) => {
  fs.writeFileSync(addressBookFile, JSON.stringify(minionsData, null, 4));
};

export const getNextAccount = (
  minions: MinionAccount[],
  getRecipient = false,
  doneProperty = 'done'
) => {
  const idx = minions.findIndex(m => (m as any)[doneProperty] !== true);
  if (idx < 0) {
    return;
  }

  const minionIndex = getRecipient ? idx + 1 : idx;
  const minion = minions[minionIndex];

  return minion;
};

export function getMinionByAddress(address: string) {
  const minions = getMinions();

  return minions.find(m => m.address.toLowerCase() === address.toLowerCase());
}
