import React, { useState, useEffect } from 'react';
import { useWeb3 } from './hooks/useWeb3';
import { useContract } from './hooks/useContract';
import Header from './components/Header';
import ArbitrageForm from './components/ArbitrageForm';
import OpportunityList from './components/OpportunityList';
import StatsCard from './components/StatsCard';
import Footer from './components/Footer';
import { AlertTriangle, Info } from 'lucide-react';
import { COMMON_TOKENS } from './config/tokens';

function App() {
  const { 
    web3, 
    account, 
    chainId, 
    isConnected, 
    isConnecting, 
    error: web3Error,
    connectWallet,
    disconnectWallet,
    supportedNetworks
  } = useWeb3();
  
  const {
    contract,
    isLoading,
    error: contractError,
    opportunities,
    stats,
    deployContract,
    checkArbitrageProfitability,
    executeArbitrage,
    withdrawProfits
  } = useContract(web3, account, chainId);
  
  const [networkName, setNetworkName] = useState<string>('Unknown Network');
  
  useEffect(() => {
    if (chainId && supportedNetworks[chainId]) {
      setNetworkName(supportedNetworks[chainId].name);
    } else if (chainId) {
      setNetworkName('Unsupported Network');
    } else {
      setNetworkName('Unknown Network');
    }
  }, [chainId, supportedNetworks]);
  
  const handleCheckProfitability = async (tokenA: string, tokenB: string, amount: string) => {
    return await checkArbitrageProfitability(tokenA, tokenB, amount);
  };
  
  const handleExecuteArbitrage = async (amount: string) => {
    return await executeArbitrage(amount);
  };
  
  const isUnsupportedNetwork = chainId && !supportedNetworks[chainId];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        account={account}
        chainId={chainId}
        networkName={networkName}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        isConnecting={isConnecting}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {web3Error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Connection Error</p>
              <p className="text-sm">{web3Error}</p>
            </div>
          </div>
        )}
        
        {isUnsupportedNetwork && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Unsupported Network</p>
              <p className="text-sm">Please switch to one of the supported networks: {Object.values(supportedNetworks).map(n => n.name).join(', ')}</p>
            </div>
          </div>
        )}
        
        {!isConnected && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Connect Your Wallet</p>
              <p className="text-sm">Connect your wallet to start using the Flash Loan Arbitrage platform</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ArbitrageForm 
              chainId={chainId}
              isConnected={isConnected}
              isLoading={isLoading}
              error={contractError}
              onCheckProfitability={handleCheckProfitability}
              onExecuteArbitrage={handleExecuteArbitrage}
            />
            
            <div className="mt-6">
              <OpportunityList opportunities={opportunities} />
            </div>
          </div>
          
          <div>
            <StatsCard stats={stats} />
            
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-medium">Select Token Pair</h3>
                    <p className="text-sm text-gray-500">Choose the tokens you want to arbitrage between</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-medium">Check Profitability</h3>
                    <p className="text-sm text-gray-500">Analyze price differences across exchanges</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-medium">Execute Arbitrage</h3>
                    <p className="text-sm text-gray-500">Use flash loans to execute profitable trades</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                    4
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-medium">Collect Profits</h3>
                    <p className="text-sm text-gray-500">Withdraw your profits to your wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;