import { Dappeteer, DappeteerPage } from '@chainsafe/dappeteer';
import {
  clickOnButton,
  clickOnElement,
  profileDropdownClick,
  typeOnInputField
} from '@chainsafe/dappeteer/dist/helpers';

export async function importNextAccount({
  mm,
  seed,
  password = '123456789'
}: {
  mm: Dappeteer;
  seed: string;
  password?: string;
}) {
  const metaMaskPage = mm.page;
  await metaMaskPage.bringToFront();

  await profileDropdownClick(metaMaskPage);
  await clickOnButton(metaMaskPage, 'Lock');
  await clickOnElement(metaMaskPage, 'Forgot password?', 'a');

  for (const [index, seedPart] of seed.split(' ').entries())
    await typeOnInputField(metaMaskPage, `${index + 1}.`, seedPart);

  await typeOnInputField(metaMaskPage, 'New password', password);
  await typeOnInputField(metaMaskPage, 'Confirm password', password);

  // onboarding/create-password URL
  await clickOnButton(metaMaskPage, 'Restore');
}
