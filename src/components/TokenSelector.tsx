import React from 'react';
import { COMMON_TOKENS } from '../config/tokens';
import { TokenInfo } from '../types/contract';

interface TokenSelectorProps {
  chainId: number | null;
  selectedToken: string;
  onChange: (tokenAddress: string) => void;
  label: string;
  disabled?: boolean;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  chainId,
  selectedToken,
  onChange,
  label,
  disabled = false,
}) => {
  const tokens = chainId ? Object.values(COMMON_TOKENS[chainId] || {}) : [];
  
  const selectedTokenInfo = tokens.find(token => token.address === selectedToken);
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select
          value={selectedToken}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || tokens.length === 0}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500"
        >
          {tokens.length === 0 ? (
            <option value="">Connect wallet to see tokens</option>
          ) : (
            <>
              <option value="">Select a token</option>
              {tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
      
      {selectedTokenInfo && (
        <div className="mt-2 flex items-center">
          <img 
            src={selectedTokenInfo.logoUrl} 
            alt={selectedTokenInfo.symbol} 
            className="w-5 h-5 mr-2 rounded-full"
          />
          <span className="text-sm text-gray-600">
            {selectedTokenInfo.symbol} - {selectedTokenInfo.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;