import React, { useState, useEffect } from 'react';
import type { AdminUser, AppEvent, WithdrawalRequest } from '../types';
import { EthereumLogo } from './icons/EthereumLogo';
import { CopyIcon } from './icons/CopyIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { TransferIcon } from './icons/TransferIcon';
import { WalletIcon } from './icons/WalletIcon';
import { ReferralIcon } from './icons/ReferralIcon';
import { ShareIcon } from './icons/ShareIcon';
import { AssistedWithdrawalIcon } from './icons/AssistedWithdrawalIcon';
import TransferAssetsModal from './TransferAssetsModal';
import * as api from './admin/api';

interface ProfilePageProps {
  ethBalance: number;
  onTransfer: (amount: number) => void;
  userWalletBalance: { usdt: number; usdc: number; };
  referrals: AdminUser[];
  onRequestAssistedWithdrawal: () => void;
  referralCode?: string;
  walletAddress: string;
}

const getStatusPill = (status: WithdrawalRequest['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Approved': return <span className={`${baseClasses} bg-green-100 text-green-700`}>Approved</span>;
        case 'Rejected': return <span className={`${baseClasses} bg-red-100 text-red-700`}>Rejected</span>;
        case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>Pending</span>;
        case 'Pending Assistance': return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>Pending Assistance</span>;
        case 'Awaiting User Confirmation': return <span className={`${baseClasses} bg-purple-100 text-purple-700`}>Awaiting Your Confirmation</span>;
        default: return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>{status}</span>;
    }
}


const ProfilePage: React.FC<ProfilePageProps> = ({ ethBalance, onTransfer, userWalletBalance, referrals, onRequestAssistedWithdrawal, referralCode, walletAddress }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [myWithdrawals, setMyWithdrawals] = useState<WithdrawalRequest[]>([]);

  const [copyText, setCopyText] = useState('Copy Link');
  const [copyAddressText, setCopyAddressText] = useState('Copy Address');
  const referralLink = referralCode ? `${window.location.origin}/?ref=${referralCode}` : 'Generating link...';

  const fetchMyWithdrawals = async () => {
    try {
        const result = await api.fetchWithdrawalsForUser(walletAddress);
        setMyWithdrawals(result.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
        console.error("Failed to fetch user withdrawals:", error);
    }
  };

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
    if(walletAddress) {
        fetchMyWithdrawals();
    }
  }, [walletAddress]);

  const handleTransfer = (amount: number) => {
    onTransfer(amount);
    setShowTransferModal(false);
  }
  
  const handleFinalConfirm = async (request: WithdrawalRequest) => {
      // In a real app, this would require signing a transaction.
      // Here, we'll just process it.
      onTransfer(request.amount);
      // And update its status
      await api.updateWithdrawalStatus(request.id, 'Approved');
      await fetchMyWithdrawals(); // Refresh the list
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Link'), 2000);
    });
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopyAddressText('Copied!');
      setTimeout(() => setCopyAddressText('Copy Address'), 2000);
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Your Profile</h1>
          <p className="text-text-secondary mb-8">Manage your mining assets, view wallet balances, and track your referrals.</p>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mining Assets */}
              <div className="bg-white/40 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-black/10 mb-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Connected Wallet</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-mono text-text-primary break-all">{walletAddress}</p>
                      <button onClick={handleCopyAddress} title={copyAddressText} className="text-gray-500 hover:text-gray-800"><CopyIcon className="w-5 h-5" /></button>
                      <a href={`https://etherscan.io/address/${walletAddress}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800"><ExternalLinkIcon className="w-5 h-5" /></a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-text-secondary mb-1">Total Mining Asset</p>
                    <p className="text-4xl font-bold flex items-center text-text-primary">
                      <EthereumLogo className="w-8 h-8 mr-2" />
                      {ethBalance.toFixed(4)}
                    </p>
                    <p className="text-text-secondary mt-1">${(ethBalance * 3500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={onRequestAssistedWithdrawal}
                        className="flex items-center justify-center py-3 px-6 bg-white/60 hover:bg-white/80 text-brand-sky rounded-md transition-colors duration-200 font-bold border border-brand-sky/30"
                      >
                        <AssistedWithdrawalIcon className="w-5 h-5 mr-2" />
                        Request Assistance
                    </button>
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="flex items-center justify-center py-3 px-6 bg-brand-sky hover:bg-brand-sky-light text-white rounded-md transition-colors duration-200 font-bold"
                    >
                      <TransferIcon className="w-5 h-5 mr-2" />
                      Transfer to Wallet
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="bg-white/40 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/40">
                <h2 className="text-xl font-bold mb-4 text-text-primary flex items-center">
                  <WalletIcon className="w-6 h-6 mr-3 text-brand-sky" />
                  Connected Wallet Balance
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/30 p-4 rounded-lg border border-white/40">
                    <p className="text-sm text-text-secondary">USDT Balance</p>
                    <p className="text-2xl font-semibold text-text-primary">{userWalletBalance.usdt.toLocaleString('en-US')}</p>
                  </div>
                  <div className="bg-white/30 p-4 rounded-lg border border-white/40">
                    <p className="text-sm text-text-secondary">USDC Balance</p>
                    <p className="text-2xl font-semibold text-text-primary">{userWalletBalance.usdc.toLocaleString('en-US')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Events */}
            <div className="lg:col-span-1 bg-white/40 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/40">
              <h2 className="text-xl font-bold mb-4 text-text-primary">Ongoing Events</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {events.length > 0 ? events.slice(0, 4).map(event => (
                  <div key={event.id} className="p-3 rounded-md bg-white/30 border border-white/40 hover:border-white/60 transition-colors">
                    <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                    <p className="text-xs text-text-secondary">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-xs text-text-secondary mt-1">{event.description}</p>
                  </div>
                )) : <p className="text-text-secondary text-sm">No recent events.</p>}
              </div>
            </div>
          </div>
          
           {/* My Requests Section */}
          <div className="mt-8">
            <div className="bg-white/40 backdrop-blur-lg rounded-lg shadow-lg border border-white/40 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-text-primary">My Requests</h2>
                </div>
                 {myWithdrawals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/5">
                                <tr className="border-b border-black/10">
                                    <th className="p-4 uppercase text-sm font-medium text-text-secondary">Date</th>
                                    <th className="p-4 uppercase text-sm font-medium text-text-secondary">Amount</th>
                                    <th className="p-4 uppercase text-sm font-medium text-text-secondary">Status</th>
                                    <th className="p-4 uppercase text-sm font-medium text-text-secondary text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myWithdrawals.map(req => (
                                    <tr key={req.id} className="border-b border-black/10 last:border-b-0 hover:bg-black/5 text-sm">
                                        <td className="p-4 text-text-primary">{new Date(req.timestamp).toLocaleString()}</td>
                                        <td className="p-4 font-mono text-text-primary">{req.amount.toFixed(4)} ETH</td>
                                        <td className="p-4">{getStatusPill(req.status)}</td>
                                        <td className="p-4 text-center">
                                            {req.status === 'Awaiting User Confirmation' ? (
                                                <button onClick={() => handleFinalConfirm(req)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">Confirm</button>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No action required</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="p-6 text-text-secondary">You have no withdrawal requests.</p>
                )}
            </div>
          </div>

          {/* Referrals Section */}
          <div className="mt-8">
            <div className="bg-white/40 backdrop-blur-lg rounded-lg shadow-lg border border-white/40 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-text-primary flex items-center">
                        <ReferralIcon className="w-6 h-6 mr-3 text-brand-sky" />
                        Your Referrals ({referrals.length})
                    </h2>
                </div>
                {referrals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/5">
                                <tr className="border-b border-black/10">
                                    <th className="p-4 uppercase text-sm font-medium text-text-secondary">Referral ID</th>
                                    <th className="p-4 uppercase text-sm font-medium text-text-secondary">Join Date</th>
                                    <th className="p-4 uppercase text-sm font-medium text-text-secondary text-right">Referral Asset (ETH)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.map(user => (
                                    <tr key={user.id} className="border-b border-black/10 last:border-b-0 hover:bg-black/5 text-sm">
                                        <td className="p-4 font-mono text-text-primary">{user.id}</td>
                                        <td className="p-4 text-text-primary">{user.joinDate}</td>
                                        <td className="p-4 font-mono text-right text-text-primary">{user.ethBalance.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="p-6 text-text-secondary">You haven't referred any users yet. Share your referral link to earn rewards!</p>
                )}
            </div>
          </div>

          {/* New Referral Link Section */}
          <div className="mt-8 bg-white/40 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/40">
            <h2 className="text-2xl font-bold text-text-primary flex items-center mb-4">
                <ShareIcon className="w-6 h-6 mr-3 text-brand-sky" />
                Invite &amp; Earn
            </h2>
            <p className="text-text-secondary mb-4">Share your unique referral link with friends. You'll earn a bonus for every new miner who joins through your link!</p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                    type="text" 
                    readOnly 
                    value={referralLink} 
                    className="w-full bg-white/50 border border-white/40 rounded-md px-3 py-2 text-text-primary text-sm font-mono focus:outline-none truncate" 
                />
                <button 
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto flex-shrink-0 bg-brand-sky hover:bg-brand-sky-light text-white font-bold py-2 px-4 rounded-md transition-colors text-sm"
                >
                    {copyText}
                </button>
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