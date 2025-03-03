import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK } from '../config/networks';

interface Web3State {
  web3: Web3 | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    web3: null,
    account: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      const web3 = new Web3(window.ethereum);
      
      setState({
        web3,
        account: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        error: error instanceof Error ? error.message : 'Failed to connect wallet' 
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setState({
      web3: null,
      account: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    if (!window.ethereum || !state.web3) {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed or not connected' }));
      return;
    }

    const network = SUPPORTED_NETWORKS[chainId];
    if (!network) {
      setState(prev => ({ ...prev, error: 'Unsupported network' }));
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: {
                  name: network.currencySymbol,
                  symbol: network.currencySymbol,
                  decimals: 18,
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.explorerUrl],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          setState(prev => ({ 
            ...prev, 
            error: addError instanceof Error ? addError.message : 'Failed to add network' 
          }));
        }
      } else {
        console.error('Error switching network:', error);
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to switch network' 
        }));
      }
    }
  }, [state.web3]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User has disconnected their wallet
          disconnectWallet();
        } else if (state.account !== accounts[0]) {
          setState(prev => ({ ...prev, account: accounts[0] }));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [state.account, disconnectWallet]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    supportedNetworks: SUPPORTED_NETWORKS,
    defaultNetwork: DEFAULT_NETWORK,
  };
};