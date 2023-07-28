import { bitgetClient } from '@app/bitget/bitgetClient';
import { getAddressForId } from '@app/bitget/depositBook/getAddressForId';
import { getETHBalance } from '@app/bitget/getETHBalance';
import { waitForDeposit } from '@app/bitget/waitForDeposit';
import { withdrawETH } from '@app/bitget/withdrawETH';

export async function testBitget() {
  // const info = await bitgetClient.getApiKeyInfo();

  // console.log('🔥 api info', info);

  // const balance = await bitgetClient.getBalance();
  // console.log('🔥 balance', balance);

  console.log('🔥acc', getAddressForId(3));

  const bal = await getETHBalance();
  // await waitForDeposit(bal);
  await withdrawETH({ recipient: '0x464fEcdb86cA7275c74bc65Fe95E72AA549Fa7ba' });
}
