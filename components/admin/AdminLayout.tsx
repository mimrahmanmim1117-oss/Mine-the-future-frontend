import React, { useState } from 'react';
import { DashboardIcon } from '../icons/DashboardIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { TransactionsIcon } from '../icons/TransactionsIcon';
import { LogoutIcon } from '../icons/LogoutIcon';
import { EthereumLogo } from '../icons/EthereumLogo';
import AdminDashboard from './AdminDashboard';
import AdminUserManagement from './AdminUserManagement';
import AdminTransactions from './AdminTransactions';
import { HomeIcon } from '../icons/HomeIcon';
import type { AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint } from '../../types';
import { WithdrawalIcon } from '../icons/WithdrawalIcon';
import { ReferralIcon } from '../icons/ReferralIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import AdminWithdrawals from './AdminWithdrawals';
import AdminReferrals from './AdminReferrals';
import AdminSiteSettings from './AdminSiteSettings';

type AdminPage = 'dashboard' | 'users' | 'transactions' | 'withdrawals' | 'referrals' | 'settings';

interface AdminLayoutProps {
  onExitAdmin: () => void;
  onLogout: () => void;
  dashboardData: { users: AdminUser[]; transactions: AdminTransaction[]; withdrawals: WithdrawalRequest[]; };
  usersData: { users: AdminUser[]; onUpdateUserStatus: (userId: string, status: AdminUser['status']) => void; };
  transactionsData: { transactions: AdminTransaction[]; };
  withdrawalsData: { withdrawals: WithdrawalRequest[]; onUpdateWithdrawalStatus: (withdrawalId: string, status: WithdrawalRequest['status']) => void; };
  referralsData: { users: AdminUser[] };
  siteSettingsData: { 
    chartData: ChartDataPoint[]; 
    events: AppEvent[]; 
    onChartDataUpdate: (data: ChartDataPoint[]) => void;
    onAddEvent: (event: Omit<AppEvent, 'id'>) => void;
    onUpdateEvent: (event: AppEvent) => void;
    onDeleteEvent: (eventId: string) => void;
  };
}

const AdminLayout: React.FC<AdminLayoutProps> = (props) => {
  const { onExitAdmin, onLogout } = props;
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <TransactionsIcon className="w-5 h-5" /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <WithdrawalIcon className="w-5 h-5" /> },
    { id: 'referrals', label: 'Referrals', icon: <ReferralIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Site Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard {...props.dashboardData} />;
      case 'users':
        return <AdminUserManagement {...props.usersData} />;
      case 'transactions':
        return <AdminTransactions {...props.transactionsData} />;
      case 'withdrawals':
        return <AdminWithdrawals {...props.withdrawalsData} />;
      case 'referrals':
        return <AdminReferrals {...props.referralsData} />;
       case 'settings':
        return <AdminSiteSettings {...props.siteSettingsData} />;
      default:
        return <AdminDashboard {...props.dashboardData} />;
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
        <nav className="flex-grow px-4 py-6 space-y-2">
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
              <span className="ml-3">{item.label}</span>
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
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;