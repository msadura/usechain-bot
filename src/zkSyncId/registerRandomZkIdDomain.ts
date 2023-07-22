import {
  getCachedActions,
  resetCacheOnAccountChange,
  setCachedActions
} from '@app/cache/accountCache';
import { getBrowserInstance } from '@app/e2e/browserInstance';
import { confirmTx } from '@app/e2e/utils/confirmTx';
import { getRandomString } from '@app/utils/getRandomString';
import { wait } from '@app/utils/wait';
import { clickOnElement } from '@chainsafe/dappeteer/dist/helpers';
import { Wallet } from 'zksync-web3';

const DAPP_URL = 'https://zksyncid.xyz/mint';
const PROMO_CODE = 'ZKSYNCID70';

function getDappUrl(domain: string) {
  return DAPP_URL.replace(':domain:', domain);
}

export async function registerRandomZkIdDomain({ wallet }: { wallet: Wallet }) {
  resetCacheOnAccountChange(wallet.address);

  const domain = getRandomString(7);

  const { dappPage, mm } = getBrowserInstance();

  if (!getCachedActions(wallet.address).registerZkIdDomain) {
    await dappPage.bringToFront();
    await dappPage.goto(DAPP_URL);
    await wait(1000);

    // connnect wallet
    const connectBtn = await dappPage.waitForSelector(
      'nav.Home_sectionNav__vRjh4 div:nth-child(3)'
    );
    console.log('🔥', 'button found');
    await connectBtn?.click?.();
    await wait(1000);

    // await dappPage.waitForSelector('//*[@name="Metamask"]');
    const body = await dappPage.getSource().waitForSelector('body');
    // hack web3modal
    await body.click({ position: { x: 500, y: 590 } });

    await mm.approve();
    await dappPage.bringToFront();
    await dappPage.reload();

    console.log('🔥', 'Registering domain:', domain);

    // search input
    const searchInput = await dappPage.waitForSelector(
      '//input[@placeholder="enter id to search"]'
    );
    console.log('🔥', 'input found');
    await searchInput.type(domain);

    await dappPage.waitForSelector('//button[contains(text(), "Search")]').then(el => el.click());
    await dappPage.waitForSelector('//button[contains(text(), "Mint")]').then(el => el.click());
    const couponInput = await dappPage.waitForSelector('//input[@placeholder="xxxxxxx"]');
    await couponInput.type(PROMO_CODE);
    await dappPage.waitForSelector('//button[contains(text(), "Submit")]').then(el => el.click());

    await wait(3000);
    await dappPage
      .waitForSelector('//button[contains(text(), "Mint Wallet id")]')
      .then(el => el.click());

    //register button
    await wait(1000);
    return;
    await confirmTx(mm.page);
    console.log('🔥', 'Domain registration confirmed');
    setCachedActions(wallet.address, { registerZkIdDomain: true });

    await wait(10000);
  }

  if (!getCachedActions(wallet.address).setZkIdProfile) {
    // console.log('🔥', 'Setting up domain in profile');
    // await dappPage.bringToFront();
    // await wait(500);
    // await dappPage.goto(PROFILE_URL);
    // await wait(500);
    // const domainInput = await dappPage.waitForSelector(
    //   '.ant-select-selection-search-input:not([disabled])'
    // );
    // await domainInput.type('.zk');
    // await dappPage.getSource().keyboard.down('Enter');
    // await clickOnElement(dappPage, 'Save', 'div');
    // await wait(5000);
    // await confirmTx(mm.page);
    // console.log('🔥', 'Domain profile set confirmed');
    // setCachedActions(wallet.address, { setZkIdProfile: true });
    // await wait(10000);
  }
}
