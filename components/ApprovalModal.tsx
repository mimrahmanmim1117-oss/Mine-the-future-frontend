import React, { useState } from 'react';
import { LockOpenIcon } from './icons/LockOpenIcon';

interface ApprovalModalProps {
  onClose: () => void;
  onConfirm: (amount: number) => void;
  currency: 'USDT' | 'USDC';
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ onClose, onConfirm, currency }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    // This simulates the user signing the approval in their wallet
    onConfirm(numericAmount);
  };
  
  const handleUnlimited = () => {
      // In a real contract, this would be MaxUint256
      const unlimitedAmount = 1_000_000_000; 
      setAmount(String(unlimitedAmount));
      // This simulates the user signing the approval in their wallet
      onConfirm(unlimitedAmount);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white/50 backdrop-blur-xl text-text-primary rounded-lg shadow-2xl max-w-md w-full border border-white/30 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-white/30 border-b border-white/30">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <LockOpenIcon className="w-6 h-6 mr-3 text-brand-sky" />
              Approve {currency} Spending
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-text-secondary mb-6">To enable one-click conversions, you need to grant our platform permission to spend your {currency}. This is a standard, secure process. Your funds remain in your wallet until you initiate a conversion.</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="allowance-amount" className="block text-sm font-medium text-text-secondary mb-2">Spending Limit</label>
              <div className="relative">
                  <input
                      id="allowance-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                          setAmount(e.target.value);
                          setError('');
                      }}
                      placeholder="e.g., 10000"
                      className="w-full bg-white/50 border border-white/40 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky"
                  />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-text-secondary sm:text-sm">{currency}</span>
                  </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex items-center gap-2">
                <button
                onClick={handleConfirm}
                className="w-full flex items-center justify-center p-3 bg-brand-sky hover:bg-brand-sky-light rounded-md transition-colors duration-200 font-bold text-white"
                >
                Approve Limit
                </button>
                 <button
                onClick={handleUnlimited}
                className="w-full flex items-center justify-center p-3 bg-white/60 hover:bg-white/80 text-brand-sky rounded-md transition-colors duration-200 font-bold border border-brand-sky/30"
                >
                Approve Unlimited
                </button>
            </div>

          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">You only need to do this once. You can revoke this permission at any time using a block explorer.</p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
