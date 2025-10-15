
import type { AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint } from '../../types';

export const mockUsers: AdminUser[] = [
  { id: 'usr_1', walletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', ipAddress: '192.168.1.1', location: 'New York, USA', joinDate: '2023-10-01', status: 'Active', ethBalance: 12.5, invitationParent: null, referrals: 2 },
  { id: 'usr_2', walletAddress: '0x1234567890abcdef1234567890abcdef12345678', ipAddress: '203.0.113.45', location: 'London, UK', joinDate: '2023-10-05', status: 'Active', ethBalance: 5.2, invitationParent: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', referrals: 1 },
  { id: 'usr_3', walletAddress: '0xfedcba9876543210fedcba9876543210fedcba98', ipAddress: '198.51.100.22', location: 'Tokyo, Japan', joinDate: '2023-10-12', status: 'Suspended', ethBalance: 0.8, invitationParent: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', referrals: 0 },
  { id: 'usr_4', walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12', ipAddress: '8.8.8.8', location: 'Mountain View, USA', joinDate: '2023-10-15', status: 'Pending', ethBalance: 0, invitationParent: '0x1234567890abcdef1234567890abcdef12345678', referrals: 0 },
  { id: 'usr_5', walletAddress: '0x11223344556677889900aabbccddeeff11223344', ipAddress: '1.1.1.1', location: 'Sydney, Australia', joinDate: '2023-11-01', status: 'Active', ethBalance: 25.1, invitationParent: null, referrals: 0 },
];

export const mockTransactions: AdminTransaction[] = [
  { id: 'txn_1', userWallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', timestamp: '2023-10-01T10:00:00Z', amount: 10000, currency: 'USDT', ethEquivalent: 2.8571, status: 'Completed' },
  { id: 'txn_2', userWallet: '0x1234567890abcdef1234567890abcdef12345678', timestamp: '2023-10-05T12:30:00Z', amount: 5000, currency: 'USDC', ethEquivalent: 1.4285, status: 'Completed' },
  { id: 'txn_3', userWallet: '0xfedcba9876543210fedcba9876543210fedcba98', timestamp: '2023-10-12T15:00:00Z', amount: 1000, currency: 'USDT', ethEquivalent: 0.2857, status: 'Completed' },
  { id: 'txn_4', userWallet: '0x11223344556677889900aabbccddeeff11223344', timestamp: '2023-11-01T09:00:00Z', amount: 25000, currency: 'USDC', ethEquivalent: 7.1428, status: 'Pending' },
  { id: 'txn_5', userWallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', timestamp: '2023-11-02T11:00:00Z', amount: 5000, currency: 'USDT', ethEquivalent: 1.4285, status: 'Failed' },
];

export const mockWithdrawals: WithdrawalRequest[] = [
  { id: 'wd_1', userWallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', timestamp: '2023-10-20T14:00:00Z', amount: 5.0, status: 'Approved' },
  { id: 'wd_2', userWallet: '0x1234567890abcdef1234567890abcdef12345678', timestamp: '2023-10-25T16:00:00Z', amount: 2.1, status: 'Pending' },
  { id: 'wd_3', userWallet: '0x11223344556677889900aabbccddeeff11223344', timestamp: '2023-11-05T18:00:00Z', amount: 10.0, status: 'Pending' },
  { id: 'wd_4', userWallet: '0xfedcba9876543210fedcba9876543210fedcba98', timestamp: '2023-11-06T10:00:00Z', amount: 0.5, status: 'Rejected' },
];

export const mockChartData: ChartDataPoint[] = [
  { name: 'Mon', value: 12.5 },
  { name: 'Tue', value: 15.2 },
  { name: 'Wed', value: 13.8 },
  { name: 'Thu', value: 18.1 },
  { name: 'Fri', value: 21.4 },
  { name: 'Sat', value: 25.9 },
  { name: 'Sun', value: 23.3 },
];

export const mockEvents: AppEvent[] = [
  {
    id: 'evt_1',
    title: 'Platform Launch',
    date: '2023-10-01',
    description: 'ETH Mining Nexus is now live! Discover our features.',
    type: 'milestone',
  },
  {
    id: 'evt_2',
    title: 'System Upgrade & AMA',
    date: '2023-10-15',
    description: 'Upgraded mining pool software and a live AMA with the dev team.',
    type: 'update',
  },
  {
    id: 'evt_3',
    title: 'New Referral Program',
    date: '2023-11-01',
    description: 'Invite your friends and earn more with our new referral rewards.',
    type: 'announcement',
  },
];
