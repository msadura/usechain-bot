import { getBrowserInstance } from '@app/e2e/browserInstance';
import { wait } from '@app/utils/wait';

export async function connectWallet(bridgeUrl: string) {
  const { mm, dappPage } = getBrowserInstance();

  await dappPage.bringToFront();
  await dappPage.goto(bridgeUrl);

  // connect MM
  await dappPage
    .waitForSelector('//button[contains(text(), "Connect Wallet")]')
    .then(el => el?.click?.());
  // hack connect modal
  const body = await dappPage.getSource().waitForSelector('body');
  await body.click({ position: { x: 600, y: 250 } });
  await mm.approve();
  await wait(3000);
}
