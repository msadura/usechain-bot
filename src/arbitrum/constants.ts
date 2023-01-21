import { TradeAsset } from '@app/types';

// MAINNET
export const SUSHI_ROUTER_ADDRESS = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506';
export const SWAPR_ROUTER_ADDRESS = '0x530476d5583724A89c8841eB6Da76E7Af4C0F17E';
export const APEX_ROUTER_ADDRESS = '0x146c57aBB43a5B457cd8E109D35Ac27057a672e2';

// TESTNET RINKEBY
// export const WETH: TradeAsset = {
//   name: 'weth',
//   address: '0xc778417e063141139fce010982780140aa0cd5ab',
//   decimals: 18
// };

// export const DAI: TradeAsset = {
//   name: 'DAI',
//   address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
//   decimals: 18
// };

//MAINNET
export const WETH: TradeAsset = {
  name: 'ETH',
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  decimals: 18
};

export const USDC: TradeAsset = {
  name: 'USDC',
  address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  decimals: 6
};

export const GUILD_BUY_ASSETS: TradeAsset[] = [
  {
    name: 'DBL',
    address: '0xd3f1Da62CAFB7E7BC6531FF1ceF6F414291F03D3',
    decimals: 18,
    tradeAmount: '0.01'
  },
  {
    name: 'DPX',
    address: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
    decimals: 18,
    tradeAmount: '0.0001'
  },
  {
    name: 'LPT',
    address: '0x289ba1701C2F088cf0faf8B3705246331cB8A839',
    decimals: 18,
    tradeAmount: '0.001'
  },
  {
    name: 'PLS',
    address: '0x51318B7D00db7ACc4026C88c3952B66278B6A67F',
    decimals: 18,
    tradeAmount: '0.001'
  },
  {
    name: 'MAGIC',
    address: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
    decimals: 18,
    tradeAmount: '0.001'
  },
  {
    name: 'LINK',
    address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    decimals: 18,
    tradeAmount: '0.001'
  },
  {
    name: 'UMAMI',
    address: '0x1622bF67e6e5747b81866fE0b85178a93C7F86e3',
    decimals: 9,
    tradeAmount: '0.001'
  },
  {
    name: 'MYC',
    address: '0xC74fE4c715510Ec2F8C61d70D397B32043F55Abe',
    decimals: 18,
    tradeAmount: '0.01'
  },
  {
    name: 'VSTA',
    address: '0xa684cd057951541187f288294a1e1C2646aA2d24',
    decimals: 18,
    tradeAmount: '0.01'
  },
  {
    name: 'JONES',
    address: '0x10393c20975cF177a3513071bC110f7962CD67da',
    decimals: 18,
    tradeAmount: '0.001'
  },
  {
    name: 'SPA',
    address: '0x5575552988A3A80504bBaeB1311674fCFd40aD4B',
    decimals: 18,
    tradeAmount: '0.01'
  },
  {
    name: 'GMX',
    address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    decimals: 18,
    tradeAmount: '0.001'
  },
  {
    name: 'SYN',
    address: '0x080F6AEd32Fc474DD5717105Dba5ea57268F46eb',
    decimals: 18,
    tradeAmount: '0.01'
  },
  {
    name: 'BRC',
    address: '0xB5de3f06aF62D8428a8BF7b4400Ea42aD2E0bc53',
    decimals: 18,
    tradeAmount: '0.01'
  }
];
