import { bitgetClient } from '@app/bitget/bitgetClient';
import { getAddressForId } from '@app/bitget/depositBook/getAddressForId';
import { getETHBalance } from '@app/bitget/getETHBalance';
import { waitForDeposit } from '@app/bitget/waitForDeposit';

export async function testBitget() {
  // const info = await bitgetClient.getApiKeyInfo();

  // console.log('🔥 api info', info);

  // const balance = await bitgetClient.getBalance();
  // console.log('🔥 balance', balance);

  console.log('🔥acc', getAddressForId(3));

  const bal = await getETHBalance();
  await waitForDeposit(bal);
}
