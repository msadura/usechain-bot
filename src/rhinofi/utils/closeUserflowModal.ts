import { getBrowserInstance } from '@app/e2e/browserInstance';

export async function closeUserflowModal() {
  const { dappPage } = getBrowserInstance();

  try {
    await dappPage.waitForSelector('div[id="userflow-ui"]', { timeout: 2000 });
    await dappPage.evaluate(async () => {
      // remove userflowjs div from DOM is it exists
      const el = window.document.getElementById('userflow-ui');
      el?.remove();
    });
  } catch (e) {}
}
