import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import RhinofiClientFactory from '@rhino.fi/client-js';
import sw from '@rhino.fi/starkware-crypto';

export type RhinoClient = any;

export async function getUnsignedClient(
  privateKey: string,
  config: Record<string, any> = { autoLoadUserConf: false }
) {
  const provider = new HDWalletProvider({
    privateKeys: [privateKey],
    providerOrUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
  });

  const web3 = new Web3(provider as any);
  provider.engine.stop();

  return await RhinofiClientFactory(web3, config);
}

export async function getRhinoClient(privateKey: string) {
  const starkPrivateKey = privateKey.replace(/^0x/, '');

  const rhinofiConfig = {
    api: 'https://api.rhino.fi',
    dataApi: 'https://api.rhino.fi',
    useAuthHeader: true,
    wallet: {
      type: 'tradingKey',
      meta: {
        starkPrivateKey
      }
    }
    // Add more variables to override default values
  };

  const rhinofi = await getUnsignedClient(privateKey, rhinofiConfig);

  return rhinofi;
}
