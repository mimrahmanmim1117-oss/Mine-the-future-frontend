import type { AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint, SiteSettings } from '../../types';

export const mockUsers: AdminUser[] = [
  { 
    id: 'usr_1', 
    walletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 
    walletName: 'MetaMask',
    referralCode: 'NEXUS7A',
    usdtDepositAddress: 'TAbcDeFgHiJkLmNoPqRsTuVwXyZ1234567890aBc',
    usdcDepositAddress: 'TDefGhiJkLmNoPqRsTuVwXyZ1234567890aBcDe',
    ipAddress: '192.168.1.1', 
    location: 'New York, USA', 
    joinDate: '2023-10-01',
    lastActive: '2023-11-10T10:00:00Z',
    status: 'Active', 
    ethBalance: 12.5, 
    walletBalance: { usdt: 50000, usdc: 25000 },
    usdtAllowance: 1000000,
    usdcAllowance: 50000,
    totalDeposits: 2,
    invitationParent: null, 
    referrals: 2 
  },
  { 
    id: 'usr_2', 
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678', 
    walletName: 'Trust Wallet',
    referralCode: 'MINE4B',
    usdtDepositAddress: 'TGhiJkLmNoPqRsTuVwXyZ1234567890aBcDeFg',
    usdcDepositAddress: 'TJkLmNoPqRsTuVwXyZ1234567890aBcDeFgHi',
    ipAddress: '203.0.113.45', 
    location: 'London, UK', 
    joinDate: '2023-10-05',
    lastActive: '2023-11-09T18:30:00Z',
    status: 'Active', 
    ethBalance: 5.2, 
    walletBalance: { usdt: 12000, usdc: 8500 },
    usdtAllowance: 5000,
    usdcAllowance: 0,
    totalDeposits: 1,
    invitationParent: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 
    referrals: 1 
  },
  { 
    id: 'usr_3', 
    walletAddress: '0xfedcba9876543210fedcba9876543210fedcba98', 
    walletName: 'Coinbase',
    referralCode: 'CRYP70',
    usdtDepositAddress: 'TLmNoPqRsTuVwXyZ1234567890aBcDeFgHiJk',
    usdcDepositAddress: 'TNoPqRsTuVwXyZ1234567890aBcDeFgHiJkLm',
    ipAddress: '198.51.100.22', 
    location: 'Tokyo, Japan', 
    joinDate: '2023-10-12', 
    lastActive: '2023-10-28T05:00:00Z',
    status: 'Suspended', 
    ethBalance: 0.8, 
    walletBalance: { usdt: 500, usdc: 1200 },
    usdtAllowance: 0,
    usdcAllowance: 0,
    totalDeposits: 1,
    invitationParent: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 
    referrals: 0 
  },
  { 
    id: 'usr_4', 
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12', 
    walletName: 'MetaMask',
    referralCode: 'E7H22X',
    usdtDepositAddress: 'TPqRsTuVwXyZ1234567890aBcDeFgHiJkLmNo',
    usdcDepositAddress: 'TRsTuVwXyZ1234567890aBcDeFgHiJkLmNoPq',
    ipAddress: '8.8.8.8', 
    location: 'Mountain View, USA', 
    joinDate: '2023-10-15',
    lastActive: '2023-10-15T12:00:00Z',
    status: 'Pending', 
    ethBalance: 0, 
    walletBalance: { usdt: 75000, usdc: 150000 },
    usdtAllowance: 0,
    usdcAllowance: 0,
    totalDeposits: 0,
    invitationParent: '0x1234567890abcdef1234567890abcdef12345678', 
    referrals: 0 
  },
  { 
    id: 'usr_5', 
    walletAddress: '0x11223344556677889900aabbccddeeff11223344', 
    walletName: 'MetaMask',
    referralCode: 'FUTURE9',
    usdtDepositAddress: 'TTuVwXyZ1234567890aBcDeFgHiJkLmNoPqRs',
    usdcDepositAddress: 'TVwXyZ1234567890aBcDeFgHiJkLmNoPqRsTu',
    ipAddress: '1.1.1.1', 
    location: 'Sydney, Australia', 
    joinDate: '2023-11-01', 
    lastActive: '2023-11-05T22:15:00Z',
    status: 'Active', 
    ethBalance: 25.1, 
    walletBalance: { usdt: 1000, usdc: 500000 },
    usdtAllowance: 1000000000,
    usdcAllowance: 1000000000,
    totalDeposits: 1,
    invitationParent: null, 
    referrals: 0 
  },
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
  { id: 'wd_5', userWallet: '0x11223344556677889900aabbccddeeff11223344', timestamp: '2023-11-08T11:00:00Z', amount: 3.5, status: 'Pending Assistance', userMessage: 'Hi, can you help me process this withdrawal to my main account? Thanks!' },
  { id: 'wd_6', userWallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', timestamp: '2023-11-09T14:00:00Z', amount: 1.0, status: 'Awaiting User Confirmation' },
];

export const mockSiteSettings: SiteSettings = {
  geminiApiKey: '',
  masterWalletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  supportTelegramUrl: 'https://t.me/ETHMiningNexusSupport',
  chartData: [
    { name: 'Mon', value: 12.5 },
    { name: 'Tue', value: 15.2 },
    { name: 'Wed', value: 13.8 },
    { name: 'Thu', value: 18.1 },
    { name: 'Fri', value: 21.4 },
    { name: 'Sat', value: 25.9 },
    { name: 'Sun', value: 23.3 },
  ],
  events: [
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
  ],
  gearRatios: [
    { id: 'g1', gear: 1, quantity: '10 ~ 1000', rateOfReturn: '0.0050 ~ 0.0060', revenueUnit: 'ETH' },
    { id: 'g2', gear: 2, quantity: '1000 ~ 5000', rateOfReturn: '0.0060 ~ 0.0065', revenueUnit: 'ETH' },
    { id: 'g3', gear: 3, quantity: '5000 ~ 20000', rateOfReturn: '0.0065 ~ 0.0075', revenueUnit: 'ETH' },
    { id: 'g4', gear: 4, quantity: '20000 ~ 50000', rateOfReturn: '0.0075 ~ 0.0080', revenueUnit: 'ETH' },
    { id: 'g5', gear: 5, quantity: '50000 ~ 100000', rateOfReturn: '0.0080 ~ 0.0085', revenueUnit: 'ETH' },
    { id: 'g6', gear: 6, quantity: '100000 ~ 250000', rateOfReturn: '0.0085 ~ 0.0150', revenueUnit: 'ETH' },
    { id: 'g7', gear: 7, quantity: '250000 ~ 99999999', rateOfReturn: '0.0150 ~ 0.0200', revenueUnit: 'ETH' },
  ],
  gearRatioDescription: `### How Gear Income is Calculated

Your potential income from mining is determined by the "Gear" level your investment falls into. Each gear has a different rate of return, which is applied to your principal amount daily.

---

#### **Example Calculation:**

Let's say you invest **$15,000 USD** (equivalent in USDT/USDC).

1.  **Determine Your Gear:** An investment of $15,000 falls into **Gear 3** (5,000 ~ 20,000).

2.  **Identify Rate of Return:** Gear 3 has a rate of return between **0.0065 and 0.0075**. The exact rate within this range is determined by current mining pool efficiency and network conditions. Let's assume the rate for today is **0.0070**.

3.  **Calculate Daily ETH Revenue:**
    *   Your Investment: \`$15,000\`
    *   Rate of Return: \`0.0070\`
    *   Daily Revenue in USD: \`$15,000 * 0.0070 = $105\`
    *   Current ETH Price (example): \`$3,500\`
    *   **Daily Revenue in ETH: \`$105 / $3,500 = 0.03 ETH\`**

This **0.03 ETH** would be added to your platform balance daily.

---

**Please Note:** The rate of return is variable within the specified range for each gear. The revenue unit is always ETH, converted based on the market price at the time of payout.`
};
