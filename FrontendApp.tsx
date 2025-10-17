import React from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import MiningPage from './components/MiningPage';
import Footer from './components/Footer';
import type { Page, AdminUser } from './types';
import ConnectPage from './components/ConnectPage';

interface FrontendAppProps {
  currentPage: Page;
  isConnected: boolean;
  isAdminAuthenticated: boolean;
  userWalletBalance: { usdt: number; usdc: number };
  platformBalance: { eth: number };
  userReferrals: AdminUser[];
  onNavigate: (page: Page) => void;
  onConnectClick: () => void;
  onDisconnect: () => void;
  onLogout: () => void;
  onEnterAdminView: () => void;
  onStartMining: (amountToConvert: number, fromCurrency: 'USDT' | 'USDC', ethEquivalent: number) => void;
  onTransfer: (amount: number) => void;
}

const FrontendApp: React.FC<FrontendAppProps> = (props) => {
  const {
    currentPage,
    isConnected,
    isAdminAuthenticated,
    userWalletBalance,
    platformBalance,
    userReferrals,
    onNavigate,
    onConnectClick,
    onDisconnect,
    onLogout,
    onEnterAdminView,
    onStartMining,
    onTransfer,
  } = props;

  if (!isConnected) {
    return (
      <div className="min-h-screen font-sans flex flex-col">
        <Header
          isConnected={false}
          isAdminAuthenticated={false}
          onConnectClick={onConnectClick}
          onNavigate={onNavigate}
          onDisconnect={() => {}}
          onLogout={() => {}}
          onEnterAdminView={() => {}}
        />
        <main className="flex-grow flex flex-col">
          <ConnectPage onConnectClick={onConnectClick} />
        </main>
        <Footer />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStartMiningClick={() => onNavigate('mining')} />;
      case 'profile':
        return <ProfilePage 
            ethBalance={platformBalance.eth} 
            onTransfer={onTransfer}
            userWalletBalance={userWalletBalance}
            referrals={userReferrals}
        />;
      case 'mining':
        return <MiningPage userWalletBalance={userWalletBalance} onStartMining={onStartMining} onNavigate={onNavigate} />;
      default:
        return <LandingPage onStartMiningClick={() => onNavigate('mining')} />;
    }
  };


  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header
        isConnected={isConnected}
        isAdminAuthenticated={isAdminAuthenticated}
        onConnectClick={onConnectClick}
        onNavigate={onNavigate}
        onDisconnect={onDisconnect}
        onLogout={onLogout}
        onEnterAdminView={onEnterAdminView}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default FrontendApp;
