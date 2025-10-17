import React, { useMemo, useState, useEffect } from 'react';
import type { AdminUser } from '../../types';
import { UsersIcon } from '../icons/UsersIcon';
import * as api from './api';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';


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

const AdminReferrals: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const referralTree = useMemo(() => {
    if (!users || users.length === 0) return [];
    
    const rootUsers: AdminUser[] = [];
    users.forEach(user => {
      if (!user.invitationParent || !users.find(u => u.walletAddress === user.invitationParent)) {
        rootUsers.push(user);
      }
    });

    return rootUsers;
  }, [users]);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;


  return (
    <div>
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
