import { wait } from '@app/utils/wait';
import { DappeteerPage } from '@chainsafe/dappeteer';
import {
  clickOnButton,
  retry,
  waitForOverlay,
  getElementByTestId
} from '@chainsafe/dappeteer/dist/helpers';

export async function confirmTx(page: DappeteerPage, skipGasButtonWait = false) {
  await page.bringToFront();
  // reload did not work
  await page.goto(page.url());

  //retry till we get prompt
  // await retry(async () => {
  //   await page.bringToFront();
  //   await page.reload();
  //   await waitForOverlay(page);
  //   if (!skipGasButtonWait) {
  //     await getElementByTestId(page, 'edit-gas-fee-button', {
  //       timeout: 500
  //     });
  //   }
  // }, 1);

  // wait for confirm button to be enabled
  await page.waitForSelector('[data-testid="page-container-footer-next"]:not([disabled])');
  await clickOnButton(page, 'Confirm');
  console.log('🔥', 'clicked btn');
}
