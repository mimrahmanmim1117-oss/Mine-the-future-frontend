import React, { useState, useEffect } from 'react';
import type { AdminUser, AppEvent } from '../types';
import { EthereumLogo } from './icons/EthereumLogo';
import { CopyIcon } from './icons/CopyIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { TransferIcon } from './icons/TransferIcon';
import { WalletIcon } from './icons/WalletIcon';
import { ReferralIcon } from './icons/ReferralIcon';
import TransferAssetsModal from './TransferAssetsModal';
import * as api from './admin/api';

interface ProfilePageProps {
  ethBalance: number;
  onTransfer: (amount: number) => void;
  userWalletBalance: { usdt: number; usdc: number; };
  referrals: AdminUser[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ ethBalance, onTransfer, userWalletBalance, referrals }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const userWalletAddress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"; // Mock address

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const settings = await api.publicFetchSiteSettings();
        setEvents(settings.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleTransfer = (amount: number) => {
    onTransfer(amount);
    setShowTransferModal(false);
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Your Profile</h1>
          <p className="text-slate-600 mb-8">Manage your mining assets, view wallet balances, and track your referrals.</p>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mining Assets */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 mb-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Connected Wallet</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-mono text-slate-800 break-all">{userWalletAddress}</p>
                      <button className="text-slate-400 hover:text-slate-700"><CopyIcon className="w-5 h-5" /></button>
                      <a href="#" className="text-slate-400 hover:text-slate-700"><ExternalLinkIcon className="w-5 h-5" /></a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-slate-500 mb-1">Total Mining Asset</p>
                    <p className="text-4xl font-bold flex items-center text-slate-900">
                      <EthereumLogo className="w-8 h-8 mr-2" />
                      {ethBalance.toFixed(4)}
                    </p>
                    <p className="text-slate-600 mt-1">${(ethBalance * 3500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                  </div>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="flex items-center justify-center py-3 px-6 bg-brand-blue hover:bg-brand-blue-light rounded-md transition-colors duration-200 font-semibold text-white"
                  >
                    <TransferIcon className="w-5 h-5 mr-2" />
                    Transfer to Wallet
                  </button>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-xl font-bold mb-4 text-slate-900 flex items-center">
                  <WalletIcon className="w-6 h-6 mr-3 text-brand-blue" />
                  Connected Wallet Balance
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-500">USDT Balance</p>
                    <p className="text-2xl font-semibold text-slate-800">{userWalletBalance.usdt.toLocaleString('en-US')}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-500">USDC Balance</p>
                    <p className="text-2xl font-semibold text-slate-800">{userWalletBalance.usdc.toLocaleString('en-US')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Events */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-slate-900">Ongoing Events</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {events.length > 0 ? events.slice(0, 4).map(event => (
                  <div key={event.id} className="p-3 rounded-md bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                    <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                    <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-600 mt-1">{event.description}</p>
                  </div>
                )) : <p className="text-slate-500 text-sm">No recent events.</p>}
              </div>
            </div>
          </div>
          
          {/* Referrals Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <ReferralIcon className="w-6 h-6 mr-3 text-brand-blue" />
                        Your Referrals ({referrals.length})
                    </h2>
                </div>
                {referrals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-slate-200">
                                    <th className="p-4 uppercase text-sm font-medium text-slate-500">Referral ID</th>
                                    <th className="p-4 uppercase text-sm font-medium text-slate-500">Join Date</th>
                                    <th className="p-4 uppercase text-sm font-medium text-slate-500 text-right">Referral Asset (ETH)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.map(user => (
                                    <tr key={user.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 text-sm">
                                        <td className="p-4 font-mono text-slate-700">{user.id}</td>
                                        <td className="p-4 text-slate-700">{user.joinDate}</td>
                                        <td className="p-4 font-mono text-right text-slate-700">{user.ethBalance.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="p-6 text-slate-500">You haven't referred any users yet. Share your referral link to earn rewards!</p>
                )}
            </div>
          </div>
        </div>
      </div>
      {showTransferModal && (
        <TransferAssetsModal
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransfer}
          currentBalance={ethBalance}
        />
      )}
    </>
  );
};

export default ProfilePage;
