import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import MiningPage from './components/MiningPage';
import Footer from './components/Footer';
import ConnectWalletModal from './components/ConnectWalletModal';

export type Page = 'landing' | 'profile' | 'mining';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userWalletBalance, setUserWalletBalance] = useState({ usdt: 0, usdc: 0 });
  const [platformBalance, setPlatformBalance] = useState({ eth: 0 });


  useEffect(() => {
    // Show modal on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleConnectWallet = () => {
    setIsConnected(true);
    setShowModal(false);
    // Initialize mock balances for the simulation
    setUserWalletBalance({ usdt: 5000, usdc: 3000 });
    setPlatformBalance({ eth: 12.45 });
    // Automatically navigate to profile after connecting
    setCurrentPage('profile'); 
  };
  
  const openConnectModal = () => {
    setShowModal(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserWalletBalance({ usdt: 0, usdc: 0 });
    setPlatformBalance({ eth: 0 });
    setCurrentPage('landing');
  };

  const navigate = (page: Page) => {
    if ((page === 'profile' || page === 'mining') && !isConnected) {
      setShowModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  const handleStartMining = (amountToConvert: number, fromCurrency: 'USDT' | 'USDC', ethEquivalent: number) => {
    // Simulate transferring from external wallet to internal platform balance
    setUserWalletBalance(prev => ({
        ...prev,
        [fromCurrency.toLowerCase()]: prev[fromCurrency.toLowerCase() as keyof typeof prev] - amountToConvert
    }));
    setPlatformBalance(prev => ({
        ...prev,
        eth: prev.eth + ethEquivalent
    }));
  };

  const handleTransferAssets = (amount: number) => {
    // This simulates transferring ETH from the mining balance back to an "external" wallet
    setPlatformBalance(prev => ({ ...prev, eth: prev.eth - amount }));
  };


  return (
    <div className="min-h-screen bg-brand-dark font-sans flex flex-col">
      <Header
        isConnected={isConnected}
        onConnectClick={openConnectModal}
        onNavigate={navigate}
        onDisconnect={handleDisconnect}
      />
      <main className="flex-grow">
        {currentPage === 'landing' && <LandingPage onStartMiningClick={() => navigate('mining')} />}
        {currentPage === 'profile' && <ProfilePage ethBalance={platformBalance.eth} onTransfer={handleTransferAssets} />}
        {currentPage === 'mining' && <MiningPage userWalletBalance={userWalletBalance} onStartMining={handleStartMining} onNavigate={navigate} />}
      </main>
      <Footer />
      {showModal && !isConnected && (
        <ConnectWalletModal
          onClose={() => setShowModal(false)}
          onConnect={handleConnectWallet}
        />
      )}
    </div>
  );
};

export default App;