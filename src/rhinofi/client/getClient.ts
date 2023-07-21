import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import RhinofiClientFactory from '@rhino.fi/client-js';
import sw from '@rhino.fi/starkware-crypto';

export type RhinoClient = Record<string, any>;

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

export async function getRhinoClient(privateKey: string, dtk?: string) {
  const pk = privateKey.replace(/^0x/, '');
  const starkPrivateKey = dtk || pk;

  const rhinofiConfig = {
    api: 'https://api.rhino.fi',
    wallet: {
      type: 'tradingKey',
      meta: {
        starkPrivateKey
      }
    }
    // Add more variables to override default values
  };

  const providerETH = new HDWalletProvider(
    pk,
    `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

  const providerZkSync = new HDWalletProvider(pk, 'https://mainnet.era.zksync.io');

  const web3ETH = new Web3(providerETH as any);
  const web3ZkSync = new Web3(providerZkSync as any);

  const rhinofi = await RhinofiClientFactory(
    { DEFAULT: web3ETH, ZKSYNC: web3ZkSync },
    rhinofiConfig
  );

  return rhinofi as RhinoClient;
}
