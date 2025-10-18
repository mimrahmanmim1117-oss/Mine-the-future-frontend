import React, { useState, useEffect, useMemo } from 'react';
import type { AdminUser } from '../../types';
import * as api from './api';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { CopyIcon } from '../icons/CopyIcon';
import { SearchIcon } from '../icons/SearchIcon';

const getStatusPillClasses = (status: AdminUser['status']) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-700';
        case 'Suspended': return 'bg-red-100 text-red-700';
        case 'Pending': return 'bg-yellow-100 text-yellow-700';
    }
};

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copyText, setCopyText] = useState('Copy');
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className="text-slate-400 hover:text-brand-blue transition-colors">
            {copyText === 'Copy' ? <CopyIcon className="w-4 h-4" /> : <span className="text-xs text-green-600 font-semibold">{copyText}</span>}
        </button>
    );
};

const AdminWallets: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await api.fetchUsers();
                setUsers(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredUsers = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        if (!lowercasedFilter) {
            return users;
        }
        return users.filter(user =>
            user.walletAddress.toLowerCase().includes(lowercasedFilter) ||
            user.usdtDepositAddress.toLowerCase().includes(lowercasedFilter) ||
            user.usdcDepositAddress.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm, users]);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div>
            <div className="mb-6">
                <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by any address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="p-4 uppercase text-sm font-medium text-slate-500">User Wallet (Connected)</th>
                                <th className="p-4 uppercase text-sm font-medium text-slate-500">USDT Deposit Address (TRC-20)</th>
                                <th className="p-4 uppercase text-sm font-medium text-slate-500">USDC Deposit Address (TRC-20)</th>
                                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 text-sm">
                                    <td className="p-4 font-mono text-slate-700">
                                        <div className="flex items-center space-x-2">
                                            <span className="truncate" title={user.walletAddress}>{`${user.walletAddress.substring(0, 10)}...${user.walletAddress.substring(user.walletAddress.length - 8)}`}</span>
                                            <CopyButton textToCopy={user.walletAddress} />
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-slate-700">
                                        <div className="flex items-center space-x-2">
                                            <span className="truncate" title={user.usdtDepositAddress}>{`${user.usdtDepositAddress.substring(0, 10)}...${user.usdtDepositAddress.substring(user.usdtDepositAddress.length - 8)}`}</span>
                                            <CopyButton textToCopy={user.usdtDepositAddress} />
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-slate-700">
                                        <div className="flex items-center space-x-2">
                                            <span className="truncate" title={user.usdcDepositAddress}>{`${user.usdcDepositAddress.substring(0, 10)}...${user.usdcDepositAddress.substring(user.usdcDepositAddress.length - 8)}`}</span>
                                            <CopyButton textToCopy={user.usdcDepositAddress} />
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPillClasses(user.status)}`}>{user.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredUsers.length === 0 && (
                        <div className="p-6 text-center text-slate-500">
                            No users found matching your search criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminWallets;