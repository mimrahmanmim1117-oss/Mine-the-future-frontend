
import React, { useState } from 'react';
import { EthereumLogo } from './icons/EthereumLogo';
import { CopyIcon } from './icons/CopyIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { TransferIcon } from './icons/TransferIcon';
import TransferAssetsModal from './TransferAssetsModal';

interface ProfilePageProps {
  ethBalance: number;
  onTransfer: (amount: number) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ ethBalance, onTransfer }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const userWalletAddress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"; // Mock address

  const handleTransfer = (amount: number) => {
    onTransfer(amount);
    setShowTransferModal(false);
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Your Profile</h1>
          <p className="text-slate-600 mb-8">Manage your mining assets and view your performance.</p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 mb-8 border-t-4 border-brand-blue">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Connected Wallet</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-mono text-slate-800">{userWalletAddress}</p>
                  <button className="text-slate-400 hover:text-slate-700"><CopyIcon className="w-5 h-5" /></button>
                  <a href="#" className="text-slate-400 hover:text-slate-700"><ExternalLinkIcon className="w-5 h-5" /></a>
                </div>
              </div>
              <div className="mt-6 md:mt-0 text-left md:text-right">
                <p className="text-sm text-slate-500 mb-1">ETH Mining Balance</p>
                <p className="text-4xl font-bold flex items-center justify-end text-slate-900">
                  <EthereumLogo className="w-8 h-8 mr-2" />
                  {ethBalance.toFixed(4)}
                </p>
                <p className="text-slate-600 mt-1">${(ethBalance * 3500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
              </div>
            </div>
            <div className="border-t border-slate-200 my-6"></div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex items-center justify-center py-3 px-6 bg-brand-blue hover:bg-brand-blue-light rounded-md transition-colors duration-200 font-semibold text-white"
              >
                <TransferIcon className="w-5 h-5 mr-2" />
                Transfer to Wallet
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