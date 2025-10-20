import React from 'react';
import { EthereumLogo } from './icons/EthereumLogo';

// This is the new icon component, defined locally for this modal
const UnlockedBonusIcon: React.FC = () => (
  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
    <div className="absolute -inset-2 rounded-full bg-brand-sky opacity-20 blur-xl animate-pulse"></div>
    <div className="absolute -inset-1 rounded-full bg-brand-sky opacity-20 blur-md animate-pulse [animation-delay:-2s]"></div>
    <div className="relative w-full h-full rounded-full bg-slate-800 p-1 flex items-center justify-center bg-gradient-to-br from-brand-sky to-brand-accent before:absolute before:inset-1 before:rounded-full before:bg-slate-800">
      <EthereumLogo className="w-12 h-12 text-white relative z-10 animate-float" />
    </div>
  </div>
);


interface EngagementModalProps {
  onClose: () => void;
  onConnect: () => void;
  referrer?: string | null;
}

const EngagementModal: React.FC<EngagementModalProps> = ({ onClose, onConnect, referrer }) => {
  const isReferred = !!referrer;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-center items-center backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-800/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 text-center overflow-hidden transform transition-all animate-scale-in">
        {/* Decorative pattern */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(60,130,246,0.1)_0,_transparent_60%)] -z-10"></div>
        
        <div className="p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-2xl leading-none">&times;</button>

            <UnlockedBonusIcon />
            
            <h2 className="text-2xl font-bold mb-3 text-white">
                {isReferred ? "You've Been Invited!" : "New Miner Bonus Unlocked!"}
            </h2>
            <p className="text-slate-400 mb-6 max-w-xs mx-auto">
              {isReferred 
                ? "Your friend has sent you a bonus. Connect your wallet to claim it and start mining."
                : "Connect your wallet to claim a head start on your mining journey."
              }
            </p>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 my-6">
                <p className="text-sm text-brand-sky-light font-semibold">YOUR BONUS</p>
                <p className="text-4xl font-bold flex items-center justify-center text-white my-1">
                    0.05 ETH
                </p>
                <p className="text-xs text-slate-500">Automatically added to your balance upon connection.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onConnect}
                    className="w-full bg-gradient-to-r from-brand-sky to-blue-600 hover:brightness-110 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-brand-sky/20 animate-pulse-fast"
                >
                    Connect &amp; Claim Bonus
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                    {isReferred ? 'Browse Site' : 'Explore First'}
                </button>
            </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes scale-in { 
          0% { opacity: 0; transform: scale(0.95) translateY(10px); } 
          100% { opacity: 1; transform: scale(1) translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default EngagementModal;