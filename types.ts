export type Page = 'landing' | 'mining' | 'profile';

export type AdminPage = 'dashboard' | 'users' | 'wallets' | 'deposits' | 'withdrawals' | 'team' | 'chart' | 'events' | 'analysis' | 'settings' | 'livechat';

export interface AdminUser {
  id: string;
  walletAddress: string;
  walletName: 'MetaMask' | 'Trust Wallet' | 'Coinbase';
  referralCode: string;
  usdtDepositAddress: string;
  usdcDepositAddress: string;
  ipAddress: string;
  location: string;
  joinDate: string;
  lastActive: string;
  status: 'Active' | 'Suspended' | 'Pending';
  ethBalance: number;
  walletBalance: { usdt: number; usdc: number; };
  usdtAllowance: number;
  usdcAllowance: number;
  totalDeposits: number;
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
  status: 'Approved' | 'Rejected' | 'Pending' | 'Pending Assistance' | 'Awaiting User Confirmation';
  userMessage?: string;
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

export interface Message {
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

export interface ChatSession {
  sessionId: string; // Corresponds to user's wallet address
  messages: Message[];
  unreadAdmin: boolean;
  lastMessageTimestamp: string;
}

export interface GearRatio {
  id: string;
  gear: number;
  quantity: string;
  rateOfReturn: string;
  revenueUnit: string;
}

export interface SiteSettings {
  geminiApiKey: string;
  masterWalletAddress: string;
  supportTelegramUrl: string;
  chartData: ChartDataPoint[];
  events: AppEvent[];
  gearRatios: GearRatio[];
  gearRatioDescription: string;
}
