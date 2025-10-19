import React, { useState, useEffect } from 'react';
import { DashboardIcon } from '../icons/DashboardIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { LogoutIcon } from '../icons/LogoutIcon';
import { EthereumLogo } from '../icons/EthereumLogo';
import { HomeIcon } from '../icons/HomeIcon';
import { WifiIcon } from '../icons/WifiIcon';
import { WifiOffIcon } from '../icons/WifiOffIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

import type { AdminPage, ChatSession, AdminUser, AdminTransaction, WithdrawalRequest, SiteSettings } from '../../types';
import * as api from './api';

import AdminDashboard from './AdminDashboard';
import AdminUserManagement from './AdminUserManagement';
import AdminTransactions from './AdminTransactions';
import AdminWithdrawals from './AdminWithdrawals';
import AdminReferrals from './AdminReferrals';
import AdminSiteSettings from './AdminSiteSettings';
import AdminChartManagement from './AdminChartManagement';
import AdminEventManagement from './AdminEventManagement';
import AdminAnalysis from './AdminAnalysis';
import AdminLiveChat from './AdminLiveChat';
import AdminWallets from './AdminWallets';

import { WalletIcon } from '../icons/WalletIcon';
import { TransactionsIcon } from '../icons/TransactionsIcon';
import { WithdrawalIcon } from '../icons/WithdrawalIcon';
import { ReferralIcon } from '../icons/ReferralIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

interface AdminLayoutProps {
  onExitAdmin: () => void;
  onLogout: () => void;
  // Data props
  users: AdminUser[];
  transactions: AdminTransaction[];
  withdrawals: WithdrawalRequest[];
  chatSessions: Record<string, ChatSession>;
  siteSettings: SiteSettings | null;
  // Handler props
  onAdminSendMessage: (sessionId: string, text: string) => void;
  onAdminReadMessage: (sessionId: string) => void;
  onUpdateUserStatus: (userId: string, status: AdminUser['status']) => void;
  onUpdateWithdrawalStatus: (withdrawalId: string, status: WithdrawalRequest['status']) => void;
  onRefreshData: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = (props) => {
  const { 
    onExitAdmin, 
    onLogout, 
    users,
    transactions,
    withdrawals,
    chatSessions, 
    siteSettings,
    onAdminSendMessage,
    onAdminReadMessage,
    onUpdateUserStatus,
    onUpdateWithdrawalStatus,
    onRefreshData
  } = props;

  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  useEffect(() => {
    api.setBackendStatus(isBackendConnected);
    if(isBackendConnected) {
        onRefreshData();
    }
  }, [isBackendConnected, onRefreshData]);

  const unreadChatCount = Object.values(chatSessions).filter((s: ChatSession) => s.unreadAdmin).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'livechat', label: 'Live Chat', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />, badge: unreadChatCount },
    { id: 'wallets', label: 'Wallets', icon: <WalletIcon className="w-5 h-5" /> },
    { id: 'deposits', label: 'Deposits', icon: <TransactionsIcon className="w-5 h-5" /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <WithdrawalIcon className="w-5 h-5" /> },
    { id: 'team', label: 'Team', icon: <ReferralIcon className="w-5 h-5" /> },
    { id: 'chart', label: 'Chart', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'events', label: 'Events', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'analysis', label: 'Analysis', icon: <SparklesIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];
  
  const renderContent = () => {
    if (!isBackendConnected) {
        return <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-8"><h2 className="text-lg font-bold">Backend Disconnected</h2><p>Please re-connect to view data.</p></div>;
    }

    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard users={users} transactions={transactions} withdrawals={withdrawals} />;
      case 'users':
        return <AdminUserManagement users={users} onUpdateUserStatus={onUpdateUserStatus} />;
       case 'livechat':
        return <AdminLiveChat 
                  sessions={chatSessions} 
                  onSendMessage={onAdminSendMessage}
                  onReadMessage={onAdminReadMessage}
                />;
       case 'wallets':
        return <AdminWallets users={users} />;
      case 'deposits':
        return <AdminTransactions transactions={transactions} />;
      case 'withdrawals':
        return <AdminWithdrawals withdrawals={withdrawals} onUpdateWithdrawalStatus={onUpdateWithdrawalStatus} />;
      case 'team':
        return <AdminReferrals users={users} />;
       case 'chart':
        return <AdminChartManagement />;
      case 'events':
        return <AdminEventManagement />;
       case 'analysis':
        return <AdminAnalysis />;
       case 'settings':
        return <AdminSiteSettings />;
      default:
        return <AdminDashboard users={users} transactions={transactions} withdrawals={withdrawals} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      <aside className="w-64 bg-white flex flex-col flex-shrink-0 border-r border-slate-200">
        <div className="h-16 flex items-center justify-center px-4 border-b border-slate-200">
           <div className="text-xl font-bold text-slate-900 flex items-center">
              <EthereumLogo className="w-7 h-7 mr-2 text-brand-blue" />
              Admin Panel
            </div>
        </div>
        <nav className="flex-grow px-4 py-6 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as AdminPage)}
              className={`w-full flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === item.id 
                ? 'bg-brand-blue text-white' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="ml-3 flex-grow text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-200 space-y-2">
            <button
                onClick={onExitAdmin}
                className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
                <HomeIcon className="w-5 h-5" />
                <span className="ml-3">Return to Site</span>
            </button>
            <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-red-500 hover:text-white transition-colors"
            >
                <LogoutIcon className="w-5 h-5" />
                <span className="ml-3">Logout</span>
            </button>
             <div className="pt-2 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Crypto Mining Inc.
             </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-auto h-screen">
         <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8">
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activePage}</h1>
            <button 
                onClick={() => setIsBackendConnected(!isBackendConnected)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isBackendConnected ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
                >
                {isBackendConnected ? <WifiIcon className="w-5 h-5" /> : <WifiOffIcon className="w-5 h-5" />}
                <span>Backend: {isBackendConnected ? 'Connected' : 'Disconnected'}</span>
            </button>
         </header>
        <div className="p-8 overflow-y-auto flex-grow">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;