import React, { useState, useEffect } from 'react';
import type { Page, AdminUser } from './types';
import { mockUsers } from './components/admin/mockData';
import AdminLayout from './components/admin/AdminLayout';
import FrontendApp from './FrontendApp';
import ConnectWalletModal from './components/ConnectWalletModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import EngagementModal from './components/EngagementModal';

function App() {
  // === STATE MANAGEMENT ===
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isConnected, setIsConnected] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Modals
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // User Data (for frontend simulation)
  const [userWalletBalance, setUserWalletBalance] = useState({ usdt: 50000, usdc: 25000 });
  const [platformBalance, setPlatformBalance] = useState({ eth: 0 });
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);


  // === HANDLERS ===
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // Connection
  const handleConnectClick = () => {
    setShowWelcomeModal(false);
    setShowConnectModal(true);
  };
  const handleConnect = () => {
    setIsConnected(true);
    setShowConnectModal(false);
    setCurrentPage('mining');
  };
  const handleDisconnect = () => {
    setIsConnected(false);
    setCurrentPage('landing');
  };

  // Admin
  const handleAdminLoginAttempt = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'password') {
      setIsAdminAuthenticated(true);
      setShowAdminLoginModal(false);
      setIsAdminView(true);
      return true;
    }
    return false;
  };
  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
  };
  const handleEnterAdminView = () => setIsAdminView(true);
  const handleExitAdminView = () => setIsAdminView(false);


  // Mining & Transfers (for frontend simulation)
  const handleStartMining = (amount: number, from: 'USDT' | 'USDC', eth: number) => {
    // Deduct from wallet balance
    setUserWalletBalance(prev => ({ ...prev, [from.toLowerCase()]: prev[from.toLowerCase() as 'usdt' | 'usdc'] - amount }));
    // Add to platform balance
    setPlatformBalance(prev => ({ eth: prev.eth + eth }));
  };

  const handleTransfer = (amount: number) => {
    if (amount <= platformBalance.eth) {
      setPlatformBalance(prev => ({ eth: prev.eth - amount }));
      // In a real app, this would trigger a blockchain transaction.
      alert(`Successfully transferred ${amount} ETH to your wallet.`);
    } else {
      alert('Insufficient balance for transfer.');
    }
  };


  useEffect(() => {
    // Secret key combination to open admin login
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Show welcome modal on first visit of the session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
        setShowWelcomeModal(true);
        sessionStorage.setItem('hasVisited', 'true');
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isAdminAuthenticated && isAdminView) {
    return (
      <AdminLayout
        onExitAdmin={handleExitAdminView}
        onLogout={handleLogout}
      />
    );
  }

  // Derive user-specific data for the profile page
  const currentUserWallet = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"; // This would be dynamic in a real app
  const userReferrals = users.filter(u => u.invitationParent === currentUserWallet);

  return (
    <>
      <FrontendApp 
        currentPage={currentPage}
        isConnected={isConnected}
        isAdminAuthenticated={isAdminAuthenticated}
        userWalletBalance={userWalletBalance}
        platformBalance={platformBalance}
        userReferrals={userReferrals}
        onNavigate={handleNavigate}
        onConnectClick={handleConnectClick}
        onDisconnect={handleDisconnect}
        onLogout={handleLogout}
        onEnterAdminView={handleEnterAdminView}
        onStartMining={handleStartMining}
        onTransfer={handleTransfer}
      />
      {showConnectModal && (
        <ConnectWalletModal
          onClose={() => setShowConnectModal(false)}
          onConnect={handleConnect}
        />
      )}
      {showAdminLoginModal && !isAdminAuthenticated && (
        <AdminLoginModal
          onClose={() => setShowAdminLoginModal(false)}
          onLoginAttempt={handleAdminLoginAttempt}
        />
      )}
      {showWelcomeModal && !isConnected && (
        <EngagementModal
          onClose={() => setShowWelcomeModal(false)}
          onConnect={handleConnectClick}
        />
      )}
    </>
  );
}

export default App;
