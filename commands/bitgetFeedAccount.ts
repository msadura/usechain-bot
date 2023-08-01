import '@app/init';

import { withdrawETH } from '@app/bitget/withdrawETH';

export async function action() {
  const ethAmount = '0.02';
  const recipient = '0xed642dC5a19095Ada69178e94a4d5e68a3502Ed3';
  const chain = 'zkSyncEra';

  if (!recipient || !ethAmount || !chain) {
    throw new Error('Missing recipient or amount or chain');
  }

  await withdrawETH({ amount: ethAmount.toString(), recipient, chain: chain.toString() });
}

action();
