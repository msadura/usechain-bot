export const RPC = {
  ETHEREUM: {
    chainId: 1,
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000', // needed for proper form handling in the TokenFormCard component
      logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880'
    },
    blockExplorerUrls: ['https://etherscan.io']
  },
  BSC: {
    chainId: 56,
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI:
        'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615'
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  POLYGON: {
    chainId: 137,
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI:
        'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912'
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com']
  },
  AVALANCHE: {
    chainId: 43114,
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818'
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io']
  },
  XDAI: {
    chainId: 100,
    chainName: 'Gnosis',
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'XDAI',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI: 'https://assets.coingecko.com/coins/images/11062/small/xdai.png?1614727492'
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai']
  },
  FANTOM: {
    chainId: 250,
    chainName: 'Fantom Opera',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI: 'https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016'
    },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorerUrls: ['https://ftmscan.com']
  },
  ARBITRUM: {
    chainId: 42161,
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880'
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    gnosisUrl: 'https://safe-transaction.arbitrum.gnosis.io'
  },
  CELO: {
    chainId: 42220,
    chainName: 'Celo',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI:
        'https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png?1592293590'
    },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://explorer.celo.org']
  },
  HARMONY: {
    chainId: 1666600000,
    chainName: 'Harmony',
    nativeCurrency: {
      name: 'Harmony',
      symbol: 'ONE',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI: 'https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png?1565065793'
    },
    rpcUrls: ['https://api.harmony.one'],
    blockExplorerUrls: ['https://explorer.harmony.one']
  },

  GOERLI: {
    chainId: 5,
    chainName: 'Ethereum - Goerli',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000', // needed for proper form handling in the TokenFormCard component
      logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880'
    },
    rpcUrls: ['https://goerli-light.eth.linkpool.io/'],
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
    gnosisUrl: 'https://safe-transaction.goerli.gnosis.io'
  },
  MUMBAI: {
    chainId: 80001,
    chainName: 'Polygon - Mumbai',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI:
        'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912'
    },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  },
  OPTIMISM: {
    chainId: 10,
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880'
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    gnosisUrl: 'https://safe-transaction.optimism.gnosis.io',
    blockExplorerUrls: ['https://optimistic.etherscan.io/']
  },
  ZKSYNC: {
    chainId: 324,
    chainName: 'zkSync Era',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880'
    },
    rpcUrls: ['https://mainnet.era.zksync.io'],
    blockExplorerUrls: ['https://explorer.zksync.io']
  }
} as const;

export type SupportedChain = keyof typeof RPC;
