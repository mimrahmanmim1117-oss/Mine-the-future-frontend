import React, { useState } from 'react';
import type { AdminUser } from '../../types';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { WalletIcon } from '../icons/WalletIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { EthereumLogo } from '../icons/EthereumLogo';

interface AdminUserManagementProps {
  users: AdminUser[];
  onUpdateUserStatus: (userId: string, status: AdminUser['status']) => void;
}

const getStatusPillClasses = (status: AdminUser['status']) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-700';
        case 'Suspended': return 'bg-red-100 text-red-700';
        case 'Pending': return 'bg-yellow-100 text-yellow-700';
    }
};

const getStatusBorderClasses = (status: AdminUser['status']) => {
    switch (status) {
        case 'Active': return 'border-green-400';
        case 'Suspended': return 'border-red-400';
        case 'Pending': return 'border-yellow-400';
    }
}

const DetailCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className="space-y-2 text-sm">
            {children}
        </div>
    </div>
);

const DetailRow: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="flex justify-between items-center">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-800 font-medium">{children}</span>
    </div>
);

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, onUpdateUserStatus }) => {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const handleToggleExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };
  
  if (!users) {
      return <div>Loading users...</div>
  }

  return (
    <div className="space-y-3">
        {users.map(user => {
            const isExpanded = expandedUserId === user.id;
            return (
                <div key={user.id} className={`bg-white rounded-lg shadow-sm border ${isExpanded ? `border-brand-blue ${getStatusBorderClasses(user.status)}` : 'border-slate-200'} transition-all`}>
                    <button onClick={() => handleToggleExpand(user.id)} className="w-full p-4 text-left flex items-center justify-between">
                       <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPillClasses(user.status)}`}>{user.status}</span>
                            <p className="ml-4 font-mono text-sm text-slate-700">{user.walletAddress}</p>
                       </div>
                       <div className="flex items-center text-sm">
                           <p className="text-slate-600 mr-4">{user.location}</p>
                           <p className="text-slate-600 mr-4 font-mono">{user.ipAddress}</p>
                           <ArrowDownIcon className={`w-5 h-5 text-slate-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                       </div>
                    </button>

                    {isExpanded && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                               <DetailCard title="Wallet Details" icon={<WalletIcon className="w-4 h-4 text-slate-500" />}>
                                    <DetailRow label="Wallet Name">{user.walletName}</DetailRow>
                                    <DetailRow label="USDT Allowance">
                                        <span className={user.usdtAllowance > 0 ? 'text-green-600' : 'text-slate-500'}>
                                            {user.usdtAllowance > 100000000 ? 'Unlimited' : user.usdtAllowance.toLocaleString()}
                                        </span>
                                    </DetailRow>
                                    <DetailRow label="USDC Allowance">
                                        <span className={user.usdcAllowance > 0 ? 'text-green-600' : 'text-slate-500'}>
                                           {user.usdcAllowance > 100000000 ? 'Unlimited' : user.usdcAllowance.toLocaleString()}
                                        </span>
                                    </DetailRow>
                               </DetailCard>

                               <DetailCard title="Asset Overview" icon={<EthereumLogo className="w-4 h-4 text-slate-500" />}>
                                    <DetailRow label="Platform Balance">{user.ethBalance.toFixed(4)} ETH</DetailRow>
                                    <DetailRow label="Wallet USDT">{user.walletBalance.usdt.toLocaleString()}</DetailRow>
                                    <DetailRow label="Wallet USDC">{user.walletBalance.usdc.toLocaleString()}</DetailRow>
                               </DetailCard>
                               
                               <DetailCard title="Activity & Referrals" icon={<ClockIcon className="w-4 h-4 text-slate-500" />}>
                                    <DetailRow label="Joined">{new Date(user.joinDate).toLocaleDateString()}</DetailRow>
                                    <DetailRow label="Last Active">{new Date(user.lastActive).toLocaleString()}</DetailRow>
                                    <DetailRow label="Total Deposits">{user.totalDeposits}</DetailRow>
                                    <DetailRow label="Referral Code">
                                      <span className="font-mono bg-slate-200 px-1 rounded text-xs">{user.referralCode}</span>
                                    </DetailRow>
                                    <DetailRow label="Invited By">
                                      {user.invitationParent ? (
                                          <span className="font-mono text-xs" title={user.invitationParent}>
                                              {`${user.invitationParent.substring(0, 8)}...`}
                                          </span>
                                      ) : (
                                          'N/A'
                                      )}
                                    </DetailRow>
                               </DetailCard>

                               <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-center space-y-2">
                                    <h3 className="text-sm font-semibold text-slate-800 text-center mb-2">Actions</h3>
                                    {user.status === 'Pending' && (
                                    <button onClick={() => onUpdateUserStatus(user.id, 'Active')} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm">
                                        Approve User
                                    </button>
                                    )}
                                    {user.status === 'Active' && (
                                    <button onClick={() => onUpdateUserStatus(user.id, 'Suspended')} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm">
                                        Suspend User
                                    </button>
                                    )}
                                    {user.status === 'Suspended' && (
                                    <button onClick={() => onUpdateUserStatus(user.id, 'Active')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm">
                                        Re-activate User
                                    </button>
                                    )}
                               </div>
                            </div>
                        </div>
                    )}
                </div>
            )
        })}
    </div>
  );
};

export default AdminUserManagement;