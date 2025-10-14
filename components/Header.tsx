
import React from 'react';
import type { Page } from '../App';
import { UserIcon } from './icons/UserIcon';
import { EthereumLogo } from './icons/EthereumLogo';
import { PickaxeIcon } from './icons/PickaxeIcon';

interface HeaderProps {
  isConnected: boolean;
  onConnectClick: () => void;
  onNavigate: (page: Page) => void;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, onConnectClick, onNavigate, onDisconnect }) => {
  return (
    <header className="bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('landing')} className="text-2xl font-bold text-white flex items-center">
              <EthereumLogo className="w-8 h-8 mr-3 text-brand-blue" />
              Mine the future
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <button onClick={() => onNavigate('mining')} className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <PickaxeIcon className="w-5 h-5 mr-2" />
                  Start Mining
                </button>
                <button onClick={() => onNavigate('profile')} className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile
                </button>
                <button 
                  onClick={onDisconnect} 
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button 
                onClick={onConnectClick} 
                className="bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
