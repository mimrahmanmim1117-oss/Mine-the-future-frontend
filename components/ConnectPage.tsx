
import React from 'react';
import { EthereumLogo } from './icons/EthereumLogo';

interface ConnectPageProps {
  onConnectClick: () => void;
}

const ConnectPage: React.FC<ConnectPageProps> = ({ onConnectClick }) => {
  return (
    <div className="flex-grow flex items-center justify-center text-center p-4 hero-pattern">
      <div className="container mx-auto">
        <div className="flex justify-center mb-6">
            <EthereumLogo className="w-20 h-20 text-brand-blue" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
          Welcome to ETH Mining Nexus
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Connect your wallet to begin your mining journey and start earning ETH rewards.
        </p>
        <button
          onClick={onConnectClick}
          className="bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 text-xl"
        >
          Connect Your Wallet
        </button>
      </div>
    </div>
  );
};

export default ConnectPage;
