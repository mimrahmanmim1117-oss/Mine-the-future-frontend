
import React from 'react';
import { EthereumLogo } from './icons/EthereumLogo';
import { GiftIcon } from './icons/GiftIcon';

interface EngagementModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const EngagementModal: React.FC<EngagementModalProps> = ({ onClose, onConnect }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl max-w-md w-full border border-slate-200 text-center overflow-hidden transform transition-all animate-fade-in-up">
        <div className="p-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-blue-700"></div>
            <div className="flex justify-center mb-5">
                <div className="bg-brand-blue/10 p-4 rounded-full">
                    <GiftIcon className="w-12 h-12 text-brand-blue" />
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-900">New Miner Bonus Unlocked!</h2>
            <p className="text-slate-600 mb-4">
                Connect your wallet to claim a <span className="font-bold text-brand-blue">0.05 ETH</span> head start on your mining journey.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-6">
                <p className="text-sm text-slate-500">Your Bonus:</p>
                <p className="text-3xl font-bold flex items-center justify-center text-slate-800">
                    <EthereumLogo className="w-7 h-7 mr-2" />
                    0.05 ETH
                </p>
                <p className="text-xs text-slate-500 mt-1">Automatically added to your balance upon connection.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onConnect}
                    className="w-full bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-md transition-all transform hover:scale-105 shadow-lg"
                >
                    Connect &amp; Claim Bonus
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-md transition-colors"
                >
                    Explore First
                </button>
            </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EngagementModal;
