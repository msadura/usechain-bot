import { setBrowserInstance } from '@app/e2e/browserInstance';
import { SupportedChain } from '@app/e2e/constants';
import { dappeteer } from '@app/e2e/dappeteer';
import { addChain } from '@app/e2e/utils/addChain';
import { wait } from '@app/utils/wait';
import { DappeteerBrowser, DappeteerPage } from '@chainsafe/dappeteer';
import { BrowserContext, Page } from 'playwright';

const headless = process.env.HEADLESS == 'true';

console.log('🔥 Browser mode:', headless ? 'HEADLESS' : 'HEADED');

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
  const browser: DappeteerBrowser<BrowserContext, Page> = (await dappeteer.launch({
    headless
  })) as unknown as DappeteerBrowser<BrowserContext, Page>;
  await wait(1000);
  // await clickOnButton(browser, 'Get Started');
  const mm = await dappeteer.setupMetaMask(browser, {
    seed,
    password
  });

  const dappPage: DappeteerPage<Page> = await browser.newPage();
  await dappPage.goto(dappUrl);

  const mmPage = mm.page;

  mmPage.setViewport({ width: 1200, height: 600 });

  if (chain) {
    // otherwise will run on eth mainnet
    await addChain({ dappPage, mm, chain });
  }

  setBrowserInstance({ dappPage, mm, browser });

  await wait(1000);

  return { mm, dappPage };
}
