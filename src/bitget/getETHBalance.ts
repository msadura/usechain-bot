import { bitgetClient } from '@app/bitget/bitgetClient';
import { parseEther } from 'ethers/lib/utils';

export async function getETHBalance() {
  try {
    const res = await bitgetClient.getBalance('ETH');

    const [ethData] = res.data;

    console.log('🔥 Bitget ETH balance:', ethData.available);

    return parseEther(ethData.available);
  } catch (e) {
    console.log('🔥', e);
    return null;
  }
}
