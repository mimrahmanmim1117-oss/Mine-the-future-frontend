export type Page = 'landing' | 'mining' | 'profile';

export type AdminPage = 'dashboard' | 'users' | 'wallets' | 'deposits' | 'withdrawals' | 'team' | 'chart' | 'events' | 'analysis' | 'settings';

export interface AdminUser {
  id: string;
  walletAddress: string;
  ipAddress: string;
  location: string;
  joinDate: string;
  status: 'Active' | 'Suspended' | 'Pending';
  ethBalance: number;
  invitationParent: string | null;
  referrals: number;
}

export interface AdminTransaction {
  id: string;
  userWallet: string;
  timestamp: string;
  amount: number;
  currency: 'USDT' | 'USDC';
  ethEquivalent: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface WithdrawalRequest {
  id: string;
  userWallet: string;
  timestamp: string;
  amount: number;
  status: 'Approved' | 'Rejected' | 'Pending';
}

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'update' | 'announcement' | 'milestone';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
