
import React from 'react';
import { TrustWalletIcon } from './icons/TrustWalletIcon';

interface ConnectWalletModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const wallets = [
  { name: 'Trust Wallet', icon: <TrustWalletIcon className="w-8 h-8" /> },
];

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ onClose, onConnect }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Connect Wallet</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors text-3xl leading-none">&times;</button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-6">Confirm connection with your wallet to start mining and manage your assets.</p>
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={onConnect}
                className="w-full flex items-center p-4 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors duration-200"
              >
                {wallet.icon}
                <span className="ml-4 font-medium">{wallet.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-6 text-center">By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
