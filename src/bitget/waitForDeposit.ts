import { bitgetClient } from '@app/bitget/bitgetClient';
import { getETHBalance } from '@app/bitget/getETHBalance';
import { Deposit, DepositStatus } from '@app/bitget/types';
import { wait } from '@app/utils/wait';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

const DEPOSIT_HISTORY_TIME = 60 * 1000; // 1 minute
const MAX_RETIRES = 3;
const RETRY_INTERVAL = 1000 * 60 * 1; // 1 minute
const WAIT_INTERVAL = 1000 * 60 * 1; // 1 minutes

export async function waitForDeposit(
  currentBalanceEth?: BigNumber | null,
  cachedStartTime?: number
) {
  const balance = currentBalanceEth || (await getETHBalance());

  const startTime = cachedStartTime || Date.now() - DEPOSIT_HISTORY_TIME;

  const verified = await watchBalance({ balance, startTime });

  return verified;
}

export async function watchBalance({
  balance,
  startTime,
  retries = 0
}: {
  balance: BigNumber | null;
  startTime: number;
  retries?: number;
}) {
  const status = await verifyBalance({ currentBalance: balance, startTime });
  if (status.deposited) {
    return true;
  }

  if (status.hasPendingDeposit) {
    console.log('🔥', `Idle wait for pending deposit, status: ${status.status || '-'}...`);
    await wait(WAIT_INTERVAL);
    return watchBalance({ balance, startTime, retries });
  }

  if (retries >= MAX_RETIRES) {
    throw 'Could not detect deposit after 3 retries';
  }

  console.log('🔥', `Retry ${retries + 1} checking if there is pending deposit...`);
  await wait(RETRY_INTERVAL);
  return watchBalance({ balance, startTime, retries: retries + 1 });
}

async function verifyBalance({
  currentBalance,
  startTime
}: {
  currentBalance: BigNumber | null;
  startTime: number;
}): Promise<{ deposited: boolean; hasPendingDeposit?: boolean; status?: DepositStatus }> {
  const balance = await getETHBalance();
  console.log('🔥 BitGet ETH balance', formatEther(balance || '0'));

  if (balance?.gt(currentBalance || 0)) {
    return { deposited: true };
  }

  const deposits = await getDeposits({
    startTime: startTime - DEPOSIT_HISTORY_TIME,
    endTime: Date.now()
  });

  if (deposits.length > 0) {
    const deposit: Deposit = deposits[0];
    return {
      deposited: deposit.status === 'success',
      hasPendingDeposit: deposit.status !== 'success',
      status: deposit.status
    };
  }

  return { deposited: false };
}

async function getDeposits({ startTime }: { startTime: number; endTime: number }) {
  const { data } = await bitgetClient.getDeposits(
    'ETH',
    startTime.toString(),
    Date.now().toString()
  );

  return data;
}
