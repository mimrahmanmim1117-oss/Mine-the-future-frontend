
import React from 'react';
// FIX: The component was moved from the 'components' directory to the root. The import paths are updated accordingly.
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import MiningPage from './components/MiningPage';
import Footer from './components/Footer';
import type { Page, AppEvent, ChartDataPoint } from './types';
import ConnectPage from './components/ConnectPage';

interface FrontendAppProps {
  currentPage: Page;
  isConnected: boolean;
  isAdminAuthenticated: boolean;
  userWalletBalance: { usdt: number; usdc: number };
  platformBalance: { eth: number };
  chartData: ChartDataPoint[];
  events: AppEvent[];
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
    chartData,
    events,
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
        return <LandingPage onStartMiningClick={() => onNavigate('mining')} chartData={chartData} events={events} />;
      case 'profile':
        return <ProfilePage ethBalance={platformBalance.eth} onTransfer={onTransfer} />;
      case 'mining':
        return <MiningPage userWalletBalance={userWalletBalance} onStartMining={onStartMining} onNavigate={onNavigate} />;
      default:
        return <LandingPage onStartMiningClick={() => onNavigate('mining')} chartData={chartData} events={events} />;
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
