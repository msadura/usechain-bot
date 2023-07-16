import { DappeteerPage } from '@chainsafe/dappeteer';
import {
  clickOnButton,
  retry,
  waitForOverlay,
  getElementByContent
} from '@chainsafe/dappeteer/dist/helpers';

export const signMessage = async (page: DappeteerPage) => {
  await page.bringToFront();

  //retry till we get prompt
  await retry(async () => {
    await page.bringToFront();
    await page.reload();
    await waitForOverlay(page);
    await getElementByContent(page, 'Sign', 'button', { timeout: 200 });
  }, 5);

  await clickOnButton(page, 'Sign');

  // const warningSignButton = await page.waitForSelector(
  //   '.signature-request-warning__footer__sign-button'
  // );
  // await warningSignButton.click();

  // wait for MM to be back in a stable state
  await page.waitForSelector('.app-header', {
    visible: true
  });
};
