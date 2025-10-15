

import React, { useState, useEffect } from 'react';
import type { Page, AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint } from './types';
import { mockUsers, mockTransactions, mockWithdrawals, mockChartData, mockEvents } from './components/admin/mockData';
import AdminLayout from './components/admin/AdminLayout';
// FIX: Update import path for FrontendApp component to resolve file structure issue.
import FrontendApp from './FrontendApp';
import ConnectWalletModal from './components/ConnectWalletModal';
import AdminLoginModal from './components/admin/AdminLoginModal';

function App() {
  // === STATE MANAGEMENT ===
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isConnected, setIsConnected] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Modals
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // User Data
  const [userWalletBalance, setUserWalletBalance] = useState({ usdt: 50000, usdc: 25000 });
  const [platformBalance, setPlatformBalance] = useState({ eth: 0 });

  // Admin Data (from mock)
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [transactions, setTransactions] = useState<AdminTransaction[]>(mockTransactions);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals);
  
  // Site-wide Data
  const [chartData, setChartData] = useState<ChartDataPoint[]>(mockChartData);
  const [events, setEvents] = useState<AppEvent[]>(mockEvents);


  // === HANDLERS ===
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // Connection
  const handleConnectClick = () => setShowConnectModal(true);
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
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
  };
  const handleEnterAdminView = () => setIsAdminView(true);
  const handleExitAdminView = () => setIsAdminView(false);


  // Mining & Transfers
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

  // Admin CRUD Operations
  const handleUpdateUserStatus = (userId: string, status: AdminUser['status']) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
  };
  const handleUpdateWithdrawalStatus = (withdrawalId: string, status: WithdrawalRequest['status']) => {
    setWithdrawals(withdrawals.map(w => w.id === withdrawalId ? { ...w, status } : w));
  };
  const handleChartDataUpdate = (data: ChartDataPoint[]) => setChartData(data);
  const handleAddEvent = (event: Omit<AppEvent, 'id'>) => {
    const newEvent = { ...event, id: `evt_${Date.now()}`};
    setEvents([newEvent, ...events]);
  };
  const handleUpdateEvent = (updatedEvent: AppEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };


  useEffect(() => {
    // Secret key combination to open admin login
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isAdminAuthenticated && isAdminView) {
    return (
      <AdminLayout
        onExitAdmin={handleExitAdminView}
        onLogout={handleAdminLogout}
        dashboardData={{ users, transactions, withdrawals }}
        usersData={{ users, onUpdateUserStatus: handleUpdateUserStatus }}
        transactionsData={{ transactions }}
        withdrawalsData={{ withdrawals, onUpdateWithdrawalStatus: handleUpdateWithdrawalStatus }}
        referralsData={{ users }}
        siteSettingsData={{ chartData, events, onChartDataUpdate: handleChartDataUpdate, onAddEvent: handleAddEvent, onUpdateEvent: handleUpdateEvent, onDeleteEvent: handleDeleteEvent }}
      />
    );
  }

  return (
    <>
      <FrontendApp 
        currentPage={currentPage}
        isConnected={isConnected}
        isAdminAuthenticated={isAdminAuthenticated}
        userWalletBalance={userWalletBalance}
        platformBalance={platformBalance}
        chartData={chartData}
        events={events}
        onNavigate={handleNavigate}
        onConnectClick={handleConnectClick}
        onDisconnect={handleDisconnect}
        // FIX: `handleLogout` was not defined. It should be `handleAdminLogout`.
        onLogout={handleAdminLogout}
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
    </>
  );
}

export default App;