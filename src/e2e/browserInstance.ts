import { Dappeteer, DappeteerBrowser, DappeteerPage } from '@chainsafe/dappeteer';
import { BrowserContext, Page } from 'playwright';

type BrowserInstance = {
  dappPage: DappeteerPage<Page>;
  mm: Dappeteer;
  browser: DappeteerBrowser<BrowserContext, Page>;
};

let instance: BrowserInstance | null = null;

export function setBrowserInstance(browserInstance: BrowserInstance | null) {
  instance = browserInstance;
}

export function getBrowserInstance() {
  if (!instance) {
    throw new Error('Browser instance is not set');
  }

  return instance;
}

export function hasBrowserInstance() {
  return !!instance;
}
