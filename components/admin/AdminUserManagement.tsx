import React from 'react';
import type { AdminUser } from '../../types';

interface AdminUserManagementProps {
    users: AdminUser[];
    onUpdateUserStatus: (userId: string, status: AdminUser['status']) => void;
}

const getStatusColor = (status: AdminUser['status']) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-700';
        case 'Suspended': return 'bg-red-100 text-red-700';
        case 'Pending': return 'bg-yellow-100 text-yellow-700';
    }
};

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, onUpdateUserStatus }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-900">User Management</h1>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="p-4 uppercase text-sm font-medium text-slate-500">Wallet Address</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500">IP Address</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500">Location</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500">Referred By</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500">Join Date</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500">Status</th>
                <th className="p-4 uppercase text-sm font-medium text-slate-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 text-sm">
                  <td className="p-4 font-mono text-slate-700 truncate" title={user.walletAddress}>{`${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`}</td>
                  <td className="p-4 font-mono text-slate-700">{user.ipAddress}</td>
                  <td className="p-4 text-slate-700">{user.location}</td>
                  <td className="p-4 font-mono text-slate-700 truncate" title={user.invitationParent}>
                    {user.invitationParent ? `${user.invitationParent.substring(0, 6)}...${user.invitationParent.substring(user.invitationParent.length - 4)}` : 'N/A'}
                  </td>
                  <td className="p-4 text-slate-700">{user.joinDate}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>{user.status}</span>
                  </td>
                  <td className="p-4 text-center">
                    {user.status === 'Pending' && (
                      <button onClick={() => onUpdateUserStatus(user.id, 'Active')} className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs">
                        Approve
                      </button>
                    )}
                    {user.status === 'Active' && (
                      <button onClick={() => onUpdateUserStatus(user.id, 'Suspended')} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs">
                        Suspend
                      </button>
                    )}
                    {user.status === 'Suspended' && (
                      <button onClick={() => onUpdateUserStatus(user.id, 'Active')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs">
                        Re-activate
                      </button>
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

export default AdminUserManagement;