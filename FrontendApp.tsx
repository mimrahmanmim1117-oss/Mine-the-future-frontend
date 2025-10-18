import React from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import MiningPage from './components/MiningPage';
import Footer from './components/Footer';
import type { Page, AdminUser } from './types';

interface FrontendAppProps {
  currentPage: Page;
  isConnected: boolean;
  isAdminAuthenticated: boolean;
  connectedWalletAddress: string | null;
  userWalletBalance: { usdt: number; usdc: number };
  platformBalance: { eth: number };
  userReferrals: AdminUser[];
  usdtAllowance: number;
  usdcAllowance: number;
  referralCode?: string;
  onNavigate: (page: Page) => void;
  onConnectClick: () => void;
  onDisconnect: () => void;
  onLogout: () => void;
  onEnterAdminView: () => void;
  onStartMining: (amountToConvert: number, fromCurrency: 'USDT' | 'USDC', ethEquivalent: number) => void;
  onSetAllowance: (amount: number, currency: 'USDT' | 'USDC') => void;
  onTransfer: (amount: number) => void;
  onCustomerServiceClick: () => void;
  onRequestAssistedWithdrawal: () => void;
}

const FrontendApp: React.FC<FrontendAppProps> = (props) => {
  const {
    currentPage,
    isConnected,
    isAdminAuthenticated,
    connectedWalletAddress,
    userWalletBalance,
    platformBalance,
    userReferrals,
    usdtAllowance,
    usdcAllowance,
    referralCode,
    onNavigate,
    onConnectClick,
    onDisconnect,
    onLogout,
    onEnterAdminView,
    onStartMining,
    onSetAllowance,
    onTransfer,
    onCustomerServiceClick,
    onRequestAssistedWithdrawal,
  } = props;

  const renderPage = () => {
    if (!isConnected || !connectedWalletAddress) {
      return <LandingPage onStartMiningClick={onConnectClick} />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onStartMiningClick={() => onNavigate('mining')} />;
      case 'profile':
        return <ProfilePage 
            ethBalance={platformBalance.eth} 
            onTransfer={onTransfer}
            userWalletBalance={userWalletBalance}
            referrals={userReferrals}
            onRequestAssistedWithdrawal={onRequestAssistedWithdrawal}
            referralCode={referralCode}
            walletAddress={connectedWalletAddress}
        />;
      case 'mining':
        return <MiningPage 
            userWalletBalance={userWalletBalance} 
            onStartMining={onStartMining} 
            onNavigate={onNavigate}
            usdtAllowance={usdtAllowance}
            usdcAllowance={usdcAllowance}
            onSetAllowance={onSetAllowance}
        />;
      default:
        return <LandingPage onStartMiningClick={() => onNavigate('mining')} />;
    }
  };


  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header
        isConnected={isConnected}
        isAdminAuthenticated={isAdminAuthenticated}
        connectedWalletAddress={connectedWalletAddress}
        onConnectClick={onConnectClick}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onEnterAdminView={onEnterAdminView}
        onCustomerServiceClick={onCustomerServiceClick}
        onDisconnect={onDisconnect}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer isConnected={isConnected} onDisconnect={onDisconnect} />
    </div>
  );
};

export default FrontendApp;