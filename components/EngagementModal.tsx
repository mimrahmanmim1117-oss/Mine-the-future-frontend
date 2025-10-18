import React from 'react';
import { EthereumLogo } from './icons/EthereumLogo';
import { GiftIcon } from './icons/GiftIcon';

interface EngagementModalProps {
  onClose: () => void;
  onConnect: () => void;
  referrer?: string | null;
}

const EngagementModal: React.FC<EngagementModalProps> = ({ onClose, onConnect, referrer }) => {
  const isReferred = !!referrer;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white/50 backdrop-blur-xl text-text-primary rounded-lg shadow-2xl max-w-md w-full border border-white/30 text-center overflow-hidden transform transition-all animate-fade-in-up">
        <div className="p-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent to-violet-500"></div>
            <div className="flex justify-center mb-5">
                <div className="bg-brand-sky/10 p-4 rounded-full">
                    <GiftIcon className="w-12 h-12 text-brand-sky" />
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
                {isReferred ? "You've Been Invited!" : "New Miner Bonus Unlocked!"}
            </h2>
            <p className="text-text-secondary mb-4">
              {isReferred 
                ? "A friend has invited you to join ETH Mining Nexus. Connect to claim your bonus and start mining!"
                : <>Connect your wallet to claim a <span className="font-bold text-brand-sky">0.05 ETH</span> head start on your mining journey.</>
              }
            </p>
            <div className="bg-white/30 border border-white/40 rounded-lg p-4 my-6">
                <p className="text-sm text-text-secondary">Your Bonus:</p>
                <p className="text-3xl font-bold flex items-center justify-center text-text-primary">
                    <EthereumLogo className="w-7 h-7 mr-2" />
                    0.05 ETH
                </p>
                <p className="text-xs text-gray-500 mt-1">Automatically added to your balance upon connection.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onConnect}
                    className="w-full bg-gradient-to-r from-brand-sky to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-md transition-all transform hover:scale-105 shadow-lg"
                >
                    Connect &amp; Claim Bonus
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-200/60 hover:bg-gray-300/60 text-text-primary font-semibold py-3 px-4 rounded-md transition-colors"
                >
                    {isReferred ? 'Browse Site' : 'Explore First'}
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