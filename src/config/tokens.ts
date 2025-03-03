import { TokenInfo } from '../types/contract';

export const COMMON_TOKENS: { [chainId: number]: { [symbol: string]: TokenInfo } } = {
  56: { // BNB Smart Chain
    WBNB: {
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      symbol: 'WBNB',
      decimals: 18,
      name: 'Wrapped BNB',
      logoUrl: 'https://tokens.pancakeswap.finance/images/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png'
    },
    BUSD: {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      symbol: 'BUSD',
      decimals: 18,
      name: 'Binance USD',
      logoUrl: 'https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png'
    },
    CAKE: {
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      symbol: 'CAKE',
      decimals: 18,
      name: 'PancakeSwap Token',
      logoUrl: 'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'
    },
    USDT: {
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      decimals: 18,
      name: 'Tether USD',
      logoUrl: 'https://tokens.pancakeswap.finance/images/0x55d398326f99059fF775485246999027B3197955.png'
    },
    ETH: {
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      symbol: 'ETH',
      decimals: 18,
      name: 'Ethereum Token',
      logoUrl: 'https://tokens.pancakeswap.finance/images/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png'
    }
  },
  1: { // Ethereum
    WETH: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether',
      logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    },
    USDC: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin',
      logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD',
      logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
    },
    DAI: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin',
      logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    }
  }
};

export const getPriceFeeds = (chainId: number): { [tokenAddress: string]: string } => {
  if (chainId === 56) {
    return {
      [COMMON_TOKENS[56].WBNB.address]: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE', // BNB/USD
      [COMMON_TOKENS[56].BUSD.address]: '0xcBb98864Ef56E9042e7d2efef76141f15731B82f', // BUSD/USD
      [COMMON_TOKENS[56].CAKE.address]: '0xB6064eD41d4f67e353768aA239cA86f4F73665a1', // CAKE/USD
      [COMMON_TOKENS[56].USDT.address]: '0xB97Ad0E74fa7d920791E90258A6E2085088b4320', // USDT/USD
      [COMMON_TOKENS[56].ETH.address]: '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e', // ETH/USD
    };
  }
  
  if (chainId === 1) {
    return {
      [COMMON_TOKENS[1].WETH.address]: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // ETH/USD
      [COMMON_TOKENS[1].USDC.address]: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6', // USDC/USD
      [COMMON_TOKENS[1].USDT.address]: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D', // USDT/USD
      [COMMON_TOKENS[1].DAI.address]: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9', // DAI/USD
    };
  }
  
  return {};
};

export const getRouterAddress = (chainId: number): string => {
  if (chainId === 56) {
    return '0x10ED43C718714eb63d5aA57B78B54704E256024E'; // PancakeSwap Router
  }
  
  if (chainId === 1) {
    return '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap V3 Router
  }
  
  return '';
};