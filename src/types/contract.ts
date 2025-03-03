export interface ContractConfig {
  address: string;
  abi: any[];
  network: string;
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  currencySymbol: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoUrl: string;
}

export interface ArbitrageOpportunity {
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  estimatedProfit: string;
  profitable: boolean;
  timestamp: number;
}

export interface ArbitrageStats {
  totalExecutions: number;
  totalProfit: string;
  averageProfit: string;
  successRate: number;
  lastExecution: number;
}