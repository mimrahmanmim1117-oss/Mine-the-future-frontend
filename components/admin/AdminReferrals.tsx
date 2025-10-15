import React, { useMemo } from 'react';
import type { AdminUser } from '../../types';
import { UsersIcon } from '../icons/UsersIcon';

interface ReferralNodeProps {
  user: AdminUser;
  children: AdminUser[];
  allUsers: AdminUser[];
  level: number;
}

const getStatusColor = (status: AdminUser['status']) => {
    switch (status) {
        case 'Active': return 'border-green-500';
        case 'Suspended': return 'border-red-500';
        case 'Pending': return 'border-yellow-500';
    }
};

const ReferralNode: React.FC<ReferralNodeProps> = ({ user, children, allUsers, level }) => {
  return (
    <div style={{ marginLeft: `${level * 2}rem` }} className="my-2">
      <div className={`bg-white p-3 rounded-lg border-l-4 ${getStatusColor(user.status)} flex items-center justify-between shadow-sm border border-slate-200`}>
        <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                <UsersIcon className="w-5 h-5 text-slate-500" />
            </div>
            <div>
                <p className="font-mono text-sm font-semibold text-slate-800 truncate" title={user.walletAddress}>{`${user.walletAddress.substring(0, 8)}...${user.walletAddress.substring(user.walletAddress.length - 6)}`}</p>
                <p className="text-xs text-slate-500">{user.location}</p>
            </div>
        </div>
        <div className="text-sm text-right">
            <p className="font-semibold text-slate-800">{user.ethBalance.toFixed(3)} ETH</p>
            <p className="text-xs text-slate-500">{user.joinDate}</p>
        </div>
      </div>
      {children.length > 0 && (
        <div className="mt-2 pl-6 border-l-2 border-slate-300">
          {children.map(child => {
            const grandChildren = allUsers.filter(u => u.invitationParent === child.walletAddress);
            return <ReferralNode key={child.id} user={child} children={grandChildren} allUsers={allUsers} level={0} />;
          })}
        </div>
      )}
    </div>
  );
};

interface AdminReferralsProps {
  users: AdminUser[];
}

const AdminReferrals: React.FC<AdminReferralsProps> = ({ users }) => {
  const referralTree = useMemo(() => {
    const usersByWallet = users.reduce((acc, user) => {
      acc[user.walletAddress] = { ...user, children: [] };
      return acc;
    }, {} as any);

    const rootUsers: AdminUser[] = [];
    
    users.forEach(user => {
      if (user.invitationParent && usersByWallet[user.invitationParent]) {
        // This is a child, do nothing here as we build from parents
      } else {
        rootUsers.push(user);
      }
    });

    return rootUsers;
  }, [users]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Referral Chains</h1>
      <p className="text-slate-600 mb-6">Visual representation of user invitation hierarchies.</p>
      
      <div className="space-y-6">
        {referralTree.map(rootUser => {
          const children = users.filter(u => u.invitationParent === rootUser.walletAddress);
          return <ReferralNode key={rootUser.id} user={rootUser} children={children} allUsers={users} level={0} />;
        })}
      </div>
    </div>
  );
};

export default AdminReferrals;