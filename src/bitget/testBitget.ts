import { bitgetClient } from '@app/bitget/bitgetClient';
import { getAddressForId } from '@app/bitget/depositBook/getAddressForId';

export async function testBitget() {
  // const info = await bitgetClient.getApiKeyInfo();

  // console.log('🔥 api info', info);

  // const balance = await bitgetClient.getBalance();
  // console.log('🔥 balance', balance);

  console.log('🔥add', getAddressForId(3));
  try {
    const asd = await bitgetClient.getPrivate('/api/spot/v1/wallet/deposit-address', {
      coin: 'ETH',
      chain: 'ETH'
    });
    console.log('🔥', asd);
  } catch (e) {
    console.log('🔥', e);
  }
}
