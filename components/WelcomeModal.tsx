import React from 'react';
import { EthereumLogo } from './icons/EthereumLogo';

interface WelcomeModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose, onConnect }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl max-w-md w-full border border-slate-200 text-center overflow-hidden transform transition-all animate-fade-in-up">
        <div className="p-8">
            <div className="flex justify-center mb-4">
                <EthereumLogo className="w-16 h-16 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to ETH Mining Nexus!</h2>
            <p className="text-slate-600 mb-6">
                Your gateway to decentralized Ethereum mining. Connect your wallet to start earning rewards today. It's secure, transparent, and powerful.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onConnect}
                    className="w-full bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-md transition-all"
                >
                    Connect Wallet Now
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-md transition-colors"
                >
                    Maybe Later
                </button>
            </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
