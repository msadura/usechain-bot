import { RPC, SupportedChain } from '@app/e2e/constants';
import { Dappeteer, DappeteerPage } from '@chainsafe/dappeteer';
import { clickOnButton, waitForOverlay, retry } from '@chainsafe/dappeteer/dist/helpers';

export async function addChain({
  dappPage,
  mm,
  chain
}: {
  dappPage: DappeteerPage;
  mm: Dappeteer;
  chain: SupportedChain;
}) {
  const chainInfo = { ...RPC[chain] };

  // add custom network to a MetaMask
  dappPage.evaluate(chainInfo => {
    const addChain = JSON.parse(chainInfo);
    addChain.chainId = `0x${Number(addChain.chainId).toString(16)}`;

    window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [addChain]
    });
  }, JSON.stringify(chainInfo));

  await acceptAddNetwork(mm.page, true);
  console.log('🔥 Chain added: ', chain);
}

export const acceptAddNetwork = async (
  page: DappeteerPage,
  shouldSwitch = false
): Promise<void> => {
  await retry(async () => {
    await page.bringToFront();
    await page.reload();
    await waitForOverlay(page);
    await page.waitForSelector('.confirmation-page', {
      timeout: 1000
    });
    await clickOnButton(page, 'Approve', { timeout: 500 });
  }, 5);
  if (shouldSwitch) {
    await clickOnButton(page, 'Switch network');
    // not showing for some networks
    // await page.waitForSelector('.new-network-info__wrapper', {
    //   visible: true
    // });
    // await clickOnButton(page, 'Got it');
  } else {
    await clickOnButton(page, 'Cancel');
  }
};
