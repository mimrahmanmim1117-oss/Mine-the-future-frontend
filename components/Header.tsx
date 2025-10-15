import React from 'react';
import type { Page } from '../types';
import { UserIcon } from './icons/UserIcon';
import { EthereumLogo } from './icons/EthereumLogo';
import { PickaxeIcon } from './icons/PickaxeIcon';
import { DashboardIcon } from './icons/DashboardIcon';

interface HeaderProps {
  isConnected: boolean;
  isAdminAuthenticated: boolean;
  onConnectClick: () => void;
  onNavigate: (page: Page) => void;
  onDisconnect: () => void;
  onLogout: () => void;
  onEnterAdminView: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isConnected, 
  isAdminAuthenticated, 
  onConnectClick, 
  onNavigate, 
  onDisconnect,
  onLogout,
  onEnterAdminView 
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('landing')} className="text-2xl font-bold text-slate-900 flex items-center">
              <EthereumLogo className="w-8 h-8 mr-3 text-brand-blue" />
              Mine the future
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && !isAdminAuthenticated && (
              <>
                <button onClick={() => onNavigate('mining')} className="flex items-center text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors">
                  <PickaxeIcon className="w-5 h-5 mr-2" />
                  Start Mining
                </button>
                <button onClick={() => onNavigate('profile')} className="flex items-center text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile
                </button>
              </>
            )}

            {isAdminAuthenticated && (
               <button onClick={onEnterAdminView} className="flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors bg-yellow-400/20 px-3 py-2 rounded-md">
                  <DashboardIcon className="w-5 h-5 mr-2" />
                  Admin Panel
                </button>
            )}
            
            {(isConnected || isAdminAuthenticated) ? (
              <button 
                onClick={isAdminAuthenticated ? onLogout : onDisconnect} 
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                {isAdminAuthenticated ? 'Logout' : 'Disconnect'}
              </button>
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