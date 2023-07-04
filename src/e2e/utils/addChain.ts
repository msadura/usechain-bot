import { RPC, SupportedChain } from '@app/e2e/constants';
import { Dappeteer, DappeteerPage } from '@chainsafe/dappeteer';

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

  await mm.acceptAddNetwork(true);
}
