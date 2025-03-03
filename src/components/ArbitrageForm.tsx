import React, { useState, useEffect } from 'react';
import TokenSelector from './TokenSelector';
import { ArrowRightLeft, Search, Play, AlertTriangle } from 'lucide-react';
import { ArbitrageOpportunity } from '../types/contract';

interface ArbitrageFormProps {
  chainId: number | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  onCheckProfitability: (tokenA: string, tokenB: string, amount: string) => Promise<ArbitrageOpportunity | undefined>;
  onExecuteArbitrage: (amount: string) => Promise<boolean | undefined>;
}

const ArbitrageForm: React.FC<ArbitrageFormProps> = ({
  chainId,
  isConnected,
  isLoading,
  error,
  onCheckProfitability,
  onExecuteArbitrage,
}) => {
  const [tokenA, setTokenA] = useState<string>('');
  const [tokenB, setTokenB] = useState<string>('');
  const [amount, setAmount] = useState<string>('1');
  const [opportunity, setOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form when chain changes
    setTokenA('');
    setTokenB('');
    setOpportunity(null);
  }, [chainId]);

  const handleSwapTokens = () => {
    const tempToken = tokenA;
    setTokenA(tokenB);
    setTokenB(tempToken);
    setOpportunity(null);
  };

  const handleCheckProfitability = async () => {
    if (!isConnected) {
      setFormError('Please connect your wallet first');
      return;
    }
    
    if (!tokenA || !tokenB) {
      setFormError('Please select both tokens');
      return;
    }
    
    if (tokenA === tokenB) {
      setFormError('Please select different tokens');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }
    
    setFormError(null);
    
    try {
      const result = await onCheckProfitability(tokenA, tokenB, amount);
      if (result) {
        setOpportunity(result);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to check profitability');
    }
  };

  const handleExecuteArbitrage = async () => {
    if (!opportunity || !opportunity.profitable) {
      setFormError('No profitable opportunity available');
      return;
    }
    
    try {
      const success = await onExecuteArbitrage(amount);
      if (success) {
        setOpportunity(null);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to execute arbitrage');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Flash Loan Arbitrage</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-2/5">
            <TokenSelector
              chainId={chainId}
              selectedToken={tokenA}
              onChange={setTokenA}
              label="Token A"
              disabled={!isConnected}
            />
          </div>
          
          <div className="flex justify-center items-center">
            <button
              onClick={handleSwapTokens}
              disabled={!isConnected}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowRightLeft className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="w-full md:w-2/5">
            <TokenSelector
              chainId={chainId}
              selectedToken={tokenB}
              onChange={setTokenB}
              label="Token B"
              disabled={!isConnected}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flash Loan Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isConnected}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
              placeholder="0.0"
              step="0.1"
              min="0.1"
            />
          </div>
        </div>
        
        {(error || formError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error || formError}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCheckProfitability}
            disabled={isLoading || !isConnected}
            className={`flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading || !isConnected ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Checking...' : 'Check Profitability'}
          </button>
          
          <button
            onClick={handleExecuteArbitrage}
            disabled={isLoading || !opportunity || !opportunity.profitable}
            className={`flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isLoading || !opportunity || !opportunity.profitable ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Executing...' : 'Execute Arbitrage'}
          </button>
        </div>
      </div>
      
      {opportunity && (
        <div className={`mt-4 p-4 rounded-md ${
          opportunity.profitable ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <h3 className="text-lg font-medium mb-2">
            {opportunity.profitable ? 'Profitable Opportunity Found!' : 'No Profitable Opportunity'}
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Token Pair:</span>
              <span className="font-medium">{opportunity.tokenA.symbol} / {opportunity.tokenB.symbol}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Profit:</span>
              <span className={`font-medium ${opportunity.profitable ? 'text-green-600' : 'text-gray-600'}`}>
                {opportunity.estimatedProfit} {opportunity.tokenA.symbol}
              </span>
            </div>
            
            {!opportunity.profitable && (
              <p className="text-sm text-yellow-700 mt-2">
                This opportunity is not profitable at the moment. Try different tokens or amounts.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArbitrageForm;