import { getBrowserInstance } from '@app/e2e/browserInstance';
import { signMessage } from '@app/e2e/utils/signMessage';
import { MinionAccount, updateMinion } from '@app/minions/minions';
import { closeUserflowModal } from '@app/rhinofi/utils/closeUserflowModal';
import { wait } from '@app/utils/wait';

const url = 'https://app.rhino.fi/portfolio';

export async function connectWallet({ minion }: { minion: MinionAccount }) {
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

  const localStorageStr = await dappPage.evaluate(() => JSON.stringify(window.localStorage));
  const localStorage = JSON.parse(localStorageStr);

  // save dtk for later use, only when key was registered in browser
  const dtk = localStorage[`dtk-${minion.address.toLowerCase()}`];
  const updatedMinon = { ...minion, dtk };
  updateMinion(updatedMinon);
}
