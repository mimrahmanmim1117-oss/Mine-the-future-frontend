import React, { useState } from 'react';
import { MetaMaskIcon } from './icons/MetaMaskIcon';
import { WalletIcon } from './icons/WalletIcon';

interface ConnectWalletModalProps {
  onClose: () => void;
  onConnectSuccess: (address: string) => void;
}

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ onClose, onConnectSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'error' | 'no-wallet'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const hasWallet = typeof window !== 'undefined' && !!window.ethereum;

  const handleConnect = async () => {
    if (!hasWallet) {
      setStatus('no-wallet');
      return;
    }

    setStatus('connecting');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        onConnectSuccess(accounts[0]);
      } else {
        throw new Error("No accounts found. Please unlock your wallet.");
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || "Failed to connect wallet. The request was rejected by the user.");
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white/50 backdrop-blur-xl text-text-primary rounded-lg shadow-2xl max-w-sm w-full border border-white/30 overflow-hidden">
        <div className="p-6 bg-white/30 border-b border-white/30">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Connect Wallet</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors text-3xl leading-none">&times;</button>
          </div>
        </div>
        <div className="p-6">
          {status === 'no-wallet' ? (
            <div className="text-center">
              <MetaMaskIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Wallet Not Detected</h3>
              <p className="text-text-secondary mb-4">No Ethereum wallet was detected in your browser. Please install a wallet like MetaMask to continue.</p>
              <a 
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
              >
                Install MetaMask
              </a>
            </div>
          ) : (
            <>
              <p className="text-text-secondary mb-6">To start mining, connect your wallet. This will allow the application to view your address and balances.</p>
              <button
                onClick={handleConnect}
                disabled={status === 'connecting'}
                className="w-full flex items-center justify-center p-4 bg-brand-sky hover:bg-brand-sky-light rounded-md transition-colors duration-200 font-bold text-white text-lg disabled:bg-gray-400"
              >
                {status === 'connecting' ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                   </>
                ) : (
                  <>
                    <WalletIcon className="w-6 h-6 mr-3" />
                    Connect Wallet
                  </>
                )}
              </button>
              {status === 'error' && <p className="text-red-500 text-sm mt-4 text-center">{errorMessage}</p>}
              <p className="text-xs text-gray-500 mt-6 text-center">By connecting your wallet, you agree to our Terms of Service.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;