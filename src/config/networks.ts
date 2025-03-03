import { NetworkConfig } from '../types/contract';

export const SUPPORTED_NETWORKS: { [chainId: number]: NetworkConfig } = {
  56: {
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorerUrl: 'https://bscscan.com',
    currencySymbol: 'BNB'
  },
  97: {
    name: 'BNB Testnet',
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorerUrl: 'https://testnet.bscscan.com',
    currencySymbol: 'tBNB'
  },
  1: {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    explorerUrl: 'https://etherscan.io',
    currencySymbol: 'ETH'
  },
  5: {
    name: 'Goerli Testnet',
    chainId: 5,
    rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    explorerUrl: 'https://goerli.etherscan.io',
    currencySymbol: 'ETH'
  }
};

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS[56]; // BNB Smart Chain by default