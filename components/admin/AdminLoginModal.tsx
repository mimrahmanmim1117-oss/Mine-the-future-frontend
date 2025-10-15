import React, { useState } from 'react';
import { LockIcon } from '../icons/LockIcon';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginAttempt: (username: string, password: string) => boolean;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginAttempt }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLoginAttempt(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <LockIcon className="w-6 h-6 mr-3 text-brand-blue" />
              Admin Access
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors text-2xl leading-none">&times;</button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600 mb-6">Enter your credentials to access the admin panel.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-600 mb-2">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="admin"
                className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-slate-600 mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {error && <p className="text-red-500 text-sm !mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center p-3 bg-brand-blue hover:bg-brand-blue-light rounded-md transition-colors duration-200 font-semibold text-white !mt-6"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;