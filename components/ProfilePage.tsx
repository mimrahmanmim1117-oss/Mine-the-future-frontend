import React, { useState } from 'react';
import type { Referral, AppEvent } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { TransferIcon } from './icons/TransferIcon';
import TransferAssetsModal from './TransferAssetsModal';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface ProfilePageProps {
  ethBalance: number;
  onTransfer: (amount: number) => void;
}

const mockReferrals: Referral[] = [
  { id: '1', walletAddress: '0x1A2...b3C4', status: 'Active', earnings: 1.25 },
  { id: '2', walletAddress: '0x5D6...e7F8', status: 'Active', earnings: 0.87 },
  { id: '3', walletAddress: '0x9G0...h1I2', status: 'Inactive', earnings: 0.12 },
  { id: '4', walletAddress: '0x3J4...k5L6', status: 'Active', earnings: 0.55 },
];

const joinedEvents: AppEvent[] = [
    { date: { day: '18', month: 'AUG' }, title: 'ETHGlobal SF', description: 'A hackathon focused on the future of Ethereum and decentralized applications.', status: 'Completed' },
    { date: { day: '03', month: 'JUN' }, title: 'Consensus 2024', description: 'The biggest event in crypto, blockchain, and Web3.', status: 'Completed' },
    { date: { day: '29', month: 'JAN' }, title: 'NFT Paris', description: 'The largest NFT conference, bringing together artists, collectors, and builders.', status: 'Completed' },
];

const InfoCard: React.FC<{ title: string; value: string; subtext?: string; children?: React.ReactNode }> = ({ title, value, subtext, children }) => (
  <div className="bg-brand-dark-light p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col">
    <h3 className="text-brand-gray text-sm font-medium uppercase tracking-wider">{title}</h3>
    <div className="flex-grow mt-2">
      <p className="text-3xl font-bold">{value}</p>
      {subtext && <p className="text-brand-gray mt-1">{subtext}</p>}
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ ethBalance, onTransfer }) => {
  const [miningStatus, setMiningStatus] = useState<'Running' | 'Stopped'>('Running');
  const [copySuccess, setCopySuccess] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const invitationLink = 'https://eth-nexus.io/invite/aBcDeF123';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationLink).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const toggleMining = () => {
    setMiningStatus(prev => prev === 'Running' ? 'Stopped' : 'Running');
  };
  
  const handleConfirmTransfer = (amount: number) => {
    onTransfer(amount);
    setIsTransferModalOpen(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
           <InfoCard title="My Assets" value={`${ethBalance.toFixed(4)} ETH`} subtext={`$${(ethBalance * 3500).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`}>
            <button 
              onClick={() => setIsTransferModalOpen(true)}
              className="w-full mt-4 bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center text-sm"
            >
              <TransferIcon className="w-5 h-5 mr-2"/>
              Transfer Assets
            </button>
          </InfoCard>
          <InfoCard title="Total Earnings" value="5.82 ETH" subtext="$20,370.00 USD" />
          <InfoCard title="Team Size" value="27 Members" subtext="4 Active" />
        </div>

        {/* Mining Status & Invitation */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-brand-dark-light p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Mining Status</h2>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-3 ${miningStatus === 'Running' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-lg font-medium">{miningStatus}</span>
                </div>
                <button onClick={toggleMining} className={`px-6 py-2 rounded-md font-semibold transition-colors ${miningStatus === 'Running' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {miningStatus === 'Running' ? 'Stop Mining' : 'Start Mining'}
                </button>
            </div>
            </div>
            <div className="bg-brand-dark-light p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Your Invitation Link</h2>
            <div className="flex items-center space-x-2">
                <input type="text" readOnly value={invitationLink} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-brand-gray focus:outline-none" />
                <button onClick={handleCopy} className="bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center">
                <CopyIcon className="w-5 h-5 mr-2"/>
                {copySuccess || 'Copy'}
                </button>
            </div>
            </div>
        </div>

        {/* Joined Events */}
        <div className="bg-brand-dark-light p-6 rounded-lg shadow-lg border border-gray-700 mb-12">
            <h2 className="text-xl font-semibold mb-4">Joined Events</h2>
            <div className="space-y-4">
                {joinedEvents.map(event => (
                    <div key={event.title} className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-800 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="text-center flex-shrink-0 bg-gray-900 p-2 rounded-md w-16">
                                <p className="text-2xl font-bold text-white">{event.date.day}</p>
                                <p className="text-xs font-medium text-brand-gray">{event.date.month}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{event.title}</h3>
                                <p className="text-sm text-brand-gray max-w-lg">{event.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">{event.status}</span>
                            <a href="#" className="p-2 text-brand-gray hover:text-white rounded-md transition-colors"><ExternalLinkIcon className="w-5 h-5" /></a>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Team Information */}
        <div className="bg-brand-dark-light p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Team Information</h2>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="border-b border-gray-700">
                    <th className="p-4 uppercase text-sm font-medium text-brand-gray">Wallet Address</th>
                    <th className="p-4 uppercase text-sm font-medium text-brand-gray">Status</th>
                    <th className="p-4 uppercase text-sm font-medium text-brand-gray text-right">Earnings (ETH)</th>
                </tr>
                </thead>
                <tbody>
                {mockReferrals.map(ref => (
                    <tr key={ref.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 font-mono">{ref.walletAddress}</td>
                    <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ref.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{ref.status}</span>
                    </td>
                    <td className="p-4 text-right font-mono">{ref.earnings.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

      </div>
      {isTransferModalOpen && (
        <TransferAssetsModal 
          onClose={() => setIsTransferModalOpen(false)}
          onTransfer={handleConfirmTransfer}
          currentBalance={ethBalance}
        />
      )}
    </>
  );
};

export default ProfilePage;