import { getBrowserInstance } from '@app/e2e/browserInstance';
import { confirmTx } from '@app/e2e/utils/confirmTx';
import { getRandomString } from '@app/utils/getRandomString';
import { wait } from '@app/utils/wait';
import { clickOnElement } from '@chainsafe/dappeteer/dist/helpers';

const DAPP_URL = 'https://app.zkns.domains/name/zk/:domain:/register';
const PROFILE_URL = 'https://app.zkns.domains/account/registrant';

function getDappUrl(domain: string) {
  return DAPP_URL.replace(':domain:', domain);
}

export async function registerRandomDomain() {
  const domain = getRandomString(7);
  const dappUrl = getDappUrl(domain);

  const { dappPage, mm } = getBrowserInstance();

  await dappPage.bringToFront();
  await dappPage.goto(dappUrl);
  await wait(1000);

  // connnect wallet
  const connectBtn = await dappPage.waitForSelector('//button[contains(text(), "Connect Wallet")]');
  await connectBtn?.click?.();
  await wait(1000);
  await mm.approve();
  await dappPage.bringToFront();
  const connectModalBtn = await dappPage.waitForSelector('.ant-modal-content ul li:nth-child(1)');
  await connectModalBtn?.click?.();

  //register button
  await wait(1000);
  // flaky selector by class
  const registerBtn = await dappPage.waitForSelector('.cWteIx');
  // better one but not working
  // await clickOnElement(dappPage, 'Request To Register with ETH', 'div');
  await registerBtn.click();
  await wait(2000);

  await confirmTx(mm.page);
  console.log('🔥', 'Domain registration confirmed');

  await wait(10000);

  await dappPage.bringToFront();
  await wait(500);
  await dappPage.goto(PROFILE_URL);
  await wait(500);
  const domainInput = await dappPage.waitForSelector(
    '.ant-select-selection-search-input:not([disabled])'
  );
  await domainInput.type('.zk');
  await dappPage.getSource().keyboard.down('Enter');
  await clickOnElement(dappPage, 'Save', 'div');

  await wait(5000);
  await confirmTx(mm.page);
  console.log('🔥', 'Domain profile set confirmed');
  await wait(10000);
}
