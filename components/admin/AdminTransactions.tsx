import React, { useState, useMemo } from 'react';
import type { AdminTransaction } from '../../types';

interface AdminTransactionsProps {
    transactions: AdminTransaction[];
}

const AdminTransactions: React.FC<AdminTransactionsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'all' | 'USDT' | 'USDC'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Completed' | 'Pending' | 'Failed'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => filter === 'all' || tx.currency === filter)
      .filter(tx => statusFilter === 'all' || tx.status === statusFilter);
  }, [filter, statusFilter, transactions]);

  const getStatusColor = (status: 'Completed' | 'Pending' | 'Failed') => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Failed': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <div className="flex items-center space-x-4">
            {/* Currency Filter */}
            <div className="flex items-center space-x-2 bg-white p-1 rounded-md border border-slate-300">
                {(['all', 'USDT', 'USDC'] as const).map((type) => (
                    <button 
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === type ? 'bg-brand-blue text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
             {/* Status Filter */}
            <div className="flex items-center space-x-2 bg-white p-1 rounded-md border border-slate-300">
                {(['all', 'Completed', 'Pending', 'Failed'] as const).map((type) => (
                    <button 
                        key={type}
                        onClick={() => setStatusFilter(type)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${statusFilter === type ? 'bg-brand-blue text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="p-4 uppercase text-sm font-medium text-slate-500">Transaction ID</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500">User Wallet</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500">Timestamp</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-right">Amount</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-right">ETH Equivalent</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50">
                  <td className="p-4 font-mono text-sm text-slate-500">{tx.id}</td>
                  <td className="p-4 font-mono text-sm text-slate-700 truncate" title={tx.userWallet}>{`${tx.userWallet.substring(0, 6)}...${tx.userWallet.substring(tx.userWallet.length - 4)}`}</td>
                  <td className="p-4 text-sm text-slate-700">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-mono text-right text-slate-700">{tx.amount.toLocaleString()} <span className="text-slate-500">{tx.currency}</span></td>
                  <td className="p-4 font-mono text-right text-slate-700">{tx.ethEquivalent.toFixed(4)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tx.status)}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;