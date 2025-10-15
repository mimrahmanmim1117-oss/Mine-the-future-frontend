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
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl p-8 max-w-sm w-full border border-slate-200 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Success!</h2>
        <p className="text-slate-600 mb-6">You have started mining with approximately <span className="font-bold text-slate-800">{ethAmount} ETH</span>. Your assets have been updated.</p>
        <button
            onClick={handleNavigate}
            className="w-full bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-md transition-all"
        >
            View My Profile
        </button>
      </div>
    </div>
  );
};

export default MiningSuccessModal;