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
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-brand-dark-light rounded-lg shadow-2xl p-8 max-w-sm w-full border border-gray-700 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
        <p className="text-brand-gray mb-6">You have started mining with approximately <span className="font-bold text-white">{ethAmount} ETH</span>. Your assets have been updated.</p>
        <button
            onClick={handleNavigate}
            className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-semibold py-3 px-4 rounded-md transition-colors"
        >
            View My Profile
        </button>
      </div>
    </div>
  );
};

export default MiningSuccessModal;
