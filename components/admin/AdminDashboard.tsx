import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AdminTransaction, AdminUser, WithdrawalRequest } from '../../types';
import { UsersIcon } from '../icons/UsersIcon';
import { EthereumLogo } from '../icons/EthereumLogo';
import { TransferIcon } from '../icons/TransferIcon';
import { WalletIcon } from '../icons/WalletIcon';


const chartData = [
  { name: 'Mon', value: 12.5 },
  { name: 'Tue', value: 15.2 },
  { name: 'Wed', value: 13.8 },
  { name: 'Thu', value: 18.1 },
  { name: 'Fri', value: 21.4 },
  { name: 'Sat', value: 25.9 },
  { name: 'Sun', value: 23.3 },
];

interface AdminDashboardProps {
    users: AdminUser[];
    transactions: AdminTransaction[];
    withdrawals: WithdrawalRequest[];
}

const InfoCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className="bg-slate-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, transactions, withdrawals }) => {
    const recentTransactions = [...transactions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    const totalEthMined = users.reduce((sum, user) => sum + user.ethBalance, 0);
    const totalValueLocked = totalEthMined * 3500; // Assuming static ETH price for simplicity
    const pendingWithdrawalsAmount = withdrawals.filter(w => w.status === 'Pending').reduce((sum, w) => sum + w.amount, 0);
    const pendingUsersCount = users.filter(u => u.status === 'Pending').length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Dashboard</h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <InfoCard title="Total Users" value={users.length.toLocaleString()} icon={<UsersIcon className="w-6 h-6 text-brand-blue" />} />
                <InfoCard title="Total ETH Mined" value={totalEthMined.toFixed(2)} icon={<EthereumLogo className="w-6 h-6 text-brand-blue" />} />
                <InfoCard title="Total Value Locked" value={`$${(totalValueLocked / 1_000_000).toFixed(2)}M`} icon={<WalletIcon className="w-6 h-6 text-brand-blue" />} />
                <InfoCard title="Pending Withdrawals" value={`${pendingWithdrawalsAmount.toFixed(2)} ETH`} icon={<TransferIcon className="w-6 h-6 text-yellow-500" />} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">Weekly Mining Activity (ETH)</h2>
                    <div className="w-full h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#1e293b' }} />
                                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 8, stroke: '#2563eb', fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-4 text-slate-900">Platform Status</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Active Users</span>
                                <span className="font-bold text-slate-800">{users.filter(u => u.status === 'Active').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Suspended Users</span>
                                <span className="font-bold text-slate-800">{users.filter(u => u.status === 'Suspended').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-yellow-600">Pending Users</span>
                                <span className="font-bold text-yellow-600">{pendingUsersCount}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-4 text-slate-900">Recent Transactions</h2>
                        <div className="space-y-4">
                            {recentTransactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-800 truncate" title={tx.userWallet}>{`${tx.userWallet.substring(0,6)}...${tx.userWallet.substring(tx.userWallet.length - 4)}`}</p>
                                        <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="font-bold text-green-600">+{tx.ethEquivalent.toFixed(4)} ETH</p>
                                        <p className="text-xs text-slate-500">{tx.amount.toLocaleString()} {tx.currency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;