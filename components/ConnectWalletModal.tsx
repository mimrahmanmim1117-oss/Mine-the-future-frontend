
import React from 'react';
import { WalletIcon } from './icons/WalletIcon';

interface ConnectWalletModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const wallets = [
  { name: 'MetaMask', icon: <WalletIcon /> },
  { name: 'Coinbase Wallet', icon: <WalletIcon /> },
  { name: 'WalletConnect', icon: <WalletIcon /> },
  { name: 'Ledger', icon: <WalletIcon /> },
];

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ onClose, onConnect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-brand-dark-light rounded-lg shadow-2xl p-8 max-w-sm w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>
        <p className="text-brand-gray mb-6">Connect your wallet to start mining and manage your assets.</p>
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={onConnect}
              className="w-full flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors duration-200"
            >
              {wallet.icon}
              <span className="ml-4 font-medium text-white">{wallet.name}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-brand-gray mt-6 text-center">By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
