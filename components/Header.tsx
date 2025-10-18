import React from 'react';
import type { Page } from '../types';
import { UserIcon } from './icons/UserIcon';
import { EthereumLogo } from './icons/EthereumLogo';
import { PickaxeIcon } from './icons/PickaxeIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { HeadsetIcon } from './icons/HeadsetIcon';
import { WalletIcon } from './icons/WalletIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  isConnected: boolean;
  isAdminAuthenticated: boolean;
  connectedWalletAddress: string | null;
  onConnectClick: () => void;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onEnterAdminView: () => void;
  onCustomerServiceClick: () => void;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isConnected, 
  isAdminAuthenticated,
  connectedWalletAddress,
  onConnectClick, 
  onNavigate, 
  onLogout,
  onEnterAdminView,
  onCustomerServiceClick,
  onDisconnect
}) => {
  return (
    <header className="bg-white/30 backdrop-blur-lg sticky top-0 z-40 border-b border-white/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('landing')} className="text-2xl font-bold text-text-primary flex items-center">
              <EthereumLogo className="w-8 h-8 mr-3 text-brand-sky" />
              Mine the future
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && !isAdminAuthenticated && (
              <>
                <button onClick={() => onNavigate('mining')} className="flex items-center text-sm font-medium text-text-secondary hover:text-brand-sky transition-colors">
                  <PickaxeIcon className="w-5 h-5 mr-2" />
                  Start Mining
                </button>
                <button onClick={() => onNavigate('profile')} className="flex items-center text-sm font-medium text-text-secondary hover:text-brand-sky transition-colors">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile
                </button>
                 <button onClick={onCustomerServiceClick} className="flex items-center text-sm font-medium text-text-secondary hover:text-brand-sky transition-colors">
                  <HeadsetIcon className="w-6 h-6 mr-2" />
                  Customer Service
                </button>
              </>
            )}

            {isAdminAuthenticated && (
               <button onClick={onEnterAdminView} className="flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors bg-yellow-400/20 px-3 py-2 rounded-md">
                  <DashboardIcon className="w-5 h-5 mr-2" />
                  Admin Panel
                </button>
            )}
            
            {isAdminAuthenticated ? (
              <button 
                onClick={onLogout} 
                className="bg-brand-accent hover:bg-brand-accent-light text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Logout
              </button>
            ) : isConnected && connectedWalletAddress ? (
              <div className="flex items-center space-x-2 bg-white/40 border border-white/50 rounded-full pl-3 pr-2 py-1.5">
                <WalletIcon className="w-5 h-5 text-brand-sky" />
                <span className="font-mono text-sm text-text-primary">
                    {`${connectedWalletAddress.substring(0, 6)}...${connectedWalletAddress.substring(connectedWalletAddress.length - 4)}`}
                </span>
                <button onClick={onDisconnect} className="bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors">
                  <LogoutIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onConnectClick} 
                className="bg-brand-sky hover:bg-brand-sky-light text-white font-bold py-2 px-4 rounded-md transition-colors text-sm"
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