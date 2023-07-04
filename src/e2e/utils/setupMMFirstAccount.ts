import { SupportedChain } from '@app/e2e/constants';
import { dappeteer } from '@app/e2e/dappeteer';
import { addChain } from '@app/e2e/utils/addChain';
import { wait } from '@app/utils/wait';

import { DappeteerPage } from '@chainsafe/dappeteer';

export async function setupMMFistAccount({
  seed,
  password = '12345678',
  dappUrl = 'https://chainlist.org/',
  chain
}: {
  seed: string;
  password?: string;
  dappUrl?: string;
  chain?: SupportedChain;
}) {
  const { metaMask: mm, browser } = await dappeteer.bootstrap({
    seed,
    password,
    headless: false,
    browser: 'chrome'
  });

  const dappPage = await browser.newPage();
  await dappPage.goto(dappUrl);

  const mmPage = await new Promise<DappeteerPage>((resolve, reject) => {
    browser
      .pages()
      .then(pages => {
        for (const page of pages) {
          if (page.url().includes('chrome-extension')) resolve(page);
        }
        reject('MetaMask extension not found');
      })
      .catch(e => reject(e));
  });

  if (chain) {
    // otherwise will run on eth mainnet
    await addChain({ dappPage, mm, chain });
  }

  await wait(1000);

  return { mmPage, mm, dappPage };
}
