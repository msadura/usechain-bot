import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { getMinions } from '@app/minions/minions';
import { getEthBalance } from '@app/rhinofi/client/getBalance';
import { getRhinoClient } from '@app/rhinofi/client/getClient';
import { register } from '@app/rhinofi/client/register';
import { sendEth } from '@app/rhinofi/client/sendEth';
import { formatRhinoEther } from '@app/rhinofi/utils/formatRhinoEther';
import { ethers } from 'ethers';
import EthCrypto from 'eth-crypto';
import { bridgedEthDeposit } from '@app/rhinofi/client/bridgedEthDeposit';
import { getZkSyncSignerFromMnemonic } from '@app/zkSync/signer';

export async function testRhinoClient() {
  const minions = getMinions();
  // const signer = getSignerFromMnemonic(minions[1].mnemonic);
  // const signer = ethers.Wallet.createRandom();
  const signer = ethers.Wallet.fromMnemonic(minions[1].mnemonic);

  // console.log('🔥', qq);

  const rhinofi = await getRhinoClient(signer.privateKey, minions[1].dtk);
  // await register({ rhinofi, wallet: signer });
  // console.log('🔥rrf', rhinofi);
  // const res = await getEthBalance(rhinofi);
  // const tokenDepositRes = await rhinofi.bridgedDeposit({
  //   chain: 'ZKSYNC',
  //   token: 'ETH',
  //   amount: '0.001',
  //   web3Options: {
  //     gasPrice: '300000000'
  //   }
  // });

  const bridgeRes = await bridgedEthDeposit({
    amount: '0.001',
    chain: 'zksync',
    wallet: getZkSyncSignerFromMnemonic(minions[1].mnemonic),
    rhinofi
  });
  // console.log('r', rhinofi);
  console.log('🔥', bridgeRes);

  // console.log('🔥 to be send', formatRhinoEther(res));
  // console.log('🔥', rhinofi);

  // const res2 = await sendEth({
  //   rhinofi,
  //   amount: 0.001,
  //   recipient: '0xC908D265EAc2dC5dD5B6280b3B8C305952363a44'
  // });

  // console.log('🔥 res2', res2);

  // console.log('🔥rf', rhinofi);
}
