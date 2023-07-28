import { bitgetClient } from '@app/bitget/bitgetClient';
import { getETHBalance } from '@app/bitget/getETHBalance';
import { formatEther, parseEther } from 'ethers/lib/utils';

export async function withdrawETH({
  recipient,
  amount,
  chain = 'ETH'
}: {
  recipient: string;
  amount?: string;
  chain?: string;
}) {
  try {
    const available = await getETHBalance();

    let withdrawAmount = available;
    if (amount && available?.gt(parseEther(amount))) {
      withdrawAmount = parseEther(amount);
    }

    if (!withdrawAmount || withdrawAmount.lte(0)) {
      throw new Error('No ETH available to withdraw on bitget');
    }

    const withdrawAmountString = formatEther(withdrawAmount);
    console.log('🔥 Withdraw amount:', withdrawAmountString);

    await bitgetClient.withdrawV2({
      coin: 'ETH',
      address: recipient,
      chain,
      amount: withdrawAmountString
    });

    console.log('🔥', `Withdrawn ETH: to address ${recipient} on chain ${chain}`);
  } catch (e) {
    console.log('🔥', e);
    return null;
  }
}
