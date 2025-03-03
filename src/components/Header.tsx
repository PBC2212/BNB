import React from 'react';
import { Wallet, Coins, Menu } from 'lucide-react';

interface HeaderProps {
  account: string | null;
  chainId: number | null;
  networkName: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

const Header: React.FC<HeaderProps> = ({
  account,
  chainId,
  networkName,
  onConnect,
  onDisconnect,
  isConnecting,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Coins className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-bold">FlashArb Pro</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {chainId && (
            <div className="hidden md:flex items-center px-3 py-1 bg-blue-800 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              {networkName}
            </div>
          )}
          
          {account ? (
            <div className="flex items-center space-x-2">
              <div className="hidden md:block px-3 py-1 bg-blue-800 rounded-full text-sm">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </div>
              <button
                onClick={onDisconnect}
                className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden md:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className={`flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors ${
                isConnecting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Wallet className="h-4 w-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
          
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;