import { getBrowserInstance } from '@app/e2e/browserInstance';
import { signMessage } from '@app/e2e/utils/signMessage';
import { closeUserflowModal } from '@app/rhinofi/utils/closeUserflowModal';
import { wait } from '@app/utils/wait';

const url = 'https://app.rhino.fi/portfolio';

export async function connectWallet() {
  const { dappPage, mm } = getBrowserInstance();

  await dappPage.bringToFront();
  await dappPage.goto(url);
  await dappPage.waitForSelector('button[id="heap-connect-wallet"]').then(el => el.click());
  await dappPage.waitForSelector('button[id="metamask"]').then(el => el.click());
  await wait(1000);
  await mm.approve();
  await dappPage.bringToFront();

  await wait(1000);

  try {
    await dappPage
      .waitForSelector('button[id="accept-all-cookies"]', { timeout: 2000 })
      .then(el => el.click());
  } catch (e) {
    console.log('🔥', 'Skip cookies button');
  }

  await dappPage
    .waitForSelector('//span[contains(text(), "Link your wallet")]')
    .then(el => el.click());

  await signMessage(mm.page);
  await dappPage.bringToFront();
  await closeUserflowModal();

  await dappPage
    .waitForSelector('//span[contains(text(), "Enable trading")]')
    .then(el => el.click());

  await signMessage(mm.page);
  await dappPage.bringToFront();
  await closeUserflowModal();
}
