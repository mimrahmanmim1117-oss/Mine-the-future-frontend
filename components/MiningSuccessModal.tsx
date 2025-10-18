import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface MiningSuccessModalProps {
  onClose: () => void;
  onNavigateToProfile: () => void;
  ethAmount: string;
}

const MiningSuccessModal: React.FC<MiningSuccessModalProps> = ({ onClose, onNavigateToProfile, ethAmount }) => {
  const handleNavigate = () => {
    onNavigateToProfile();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white/50 backdrop-blur-xl text-text-primary rounded-lg shadow-2xl p-8 max-w-sm w-full border border-white/30 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Success!</h2>
        <p className="text-text-secondary mb-6">You have started mining with approximately <span className="font-bold text-text-primary">{ethAmount} ETH</span>. Your assets have been updated.</p>
        <button
            onClick={handleNavigate}
            className="w-full bg-gradient-to-r from-brand-sky to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-md transition-all"
        >
            View My Profile
        </button>
      </div>
    </div>
  );
};

export default MiningSuccessModal;