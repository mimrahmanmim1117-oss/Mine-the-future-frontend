import React from 'react';
import type { WithdrawalRequest } from '../../types';
import { EthereumLogo } from '../icons/EthereumLogo';

interface AdminWithdrawalsProps {
    withdrawals: WithdrawalRequest[];
    onUpdateWithdrawalStatus: (withdrawalId: string, status: WithdrawalRequest['status']) => void;
}

const getStatusColor = (status: WithdrawalRequest['status']) => {
    switch (status) {
        case 'Approved': return 'bg-green-100 text-green-700';
        case 'Rejected': return 'bg-red-100 text-red-700';
        case 'Pending': return 'bg-yellow-100 text-yellow-700';
        case 'Pending Assistance': return 'bg-blue-100 text-blue-700';
        case 'Awaiting User Confirmation': return 'bg-purple-100 text-purple-700';
    }
};

const AdminWithdrawals: React.FC<AdminWithdrawalsProps> = ({ withdrawals, onUpdateWithdrawalStatus }) => {
    
    if (!withdrawals) {
        return <div>Loading withdrawals...</div>
    }

    const sortedWithdrawals = [...withdrawals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="p-4 uppercase text-sm font-medium text-slate-500">User Wallet</th>
                                <th className="p-4 uppercase text-sm font-medium text-slate-500">Timestamp</th>
                                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-right">Amount (ETH)</th>
                                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-center">Status</th>
                                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedWithdrawals.map(w => (
                                <tr key={w.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 text-sm">
                                    <td className="p-4">
                                      <p className="font-mono text-slate-700 truncate" title={w.userWallet}>{`${w.userWallet.substring(0, 10)}...${w.userWallet.substring(w.userWallet.length - 4)}`}</p>
                                      {w.userMessage && <p className="text-xs text-slate-500 italic mt-1">"{w.userMessage}"</p>}
                                    </td>
                                    <td className="p-4 text-slate-700">{new Date(w.timestamp).toLocaleString()}</td>
                                    <td className="p-4 font-mono text-right flex items-center justify-end text-slate-700">
                                        <EthereumLogo className="w-4 h-4 mr-2" />
                                        {w.amount.toFixed(4)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(w.status)}`}>{w.status}</span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        {w.status === 'Pending' && (
                                            <>
                                                <button onClick={() => onUpdateWithdrawalStatus(w.id, 'Approved')} className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs">
                                                    Approve
                                                </button>
                                                <button onClick={() => onUpdateWithdrawalStatus(w.id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs">
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {w.status === 'Pending Assistance' && (
                                            <>
                                                <button onClick={() => onUpdateWithdrawalStatus(w.id, 'Awaiting User Confirmation')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs">
                                                    Prepare
                                                </button>
                                                <button onClick={() => onUpdateWithdrawalStatus(w.id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs">
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {w.status === 'Awaiting User Confirmation' && (
                                            <span className="text-xs text-purple-700 italic">Waiting for User</span>
                                        )}
                                        {(w.status === 'Approved' || w.status === 'Rejected') && (
                                            <span className="text-xs text-slate-500 italic">Processed</span>
                                        )}
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

export default AdminWithdrawals;