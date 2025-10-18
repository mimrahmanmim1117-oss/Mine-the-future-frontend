import React, { useState } from 'react';
import { AssistedWithdrawalIcon } from './icons/AssistedWithdrawalIcon';
import { EthereumLogo } from './icons/EthereumLogo';

interface RequestAssistanceModalProps {
  onClose: () => void;
  onSubmit: (amount: number, message: string) => void;
  currentBalance: number;
}

const RequestAssistanceModal: React.FC<RequestAssistanceModalProps> = ({ onClose, onSubmit, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (numericAmount > currentBalance) {
      setError('Amount cannot exceed your current balance.');
      return;
    }
    onSubmit(numericAmount, message);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white/50 backdrop-blur-xl text-text-primary rounded-lg shadow-2xl max-w-md w-full border border-white/30 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-white/30 border-b border-white/30">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <AssistedWithdrawalIcon className="w-6 h-6 mr-3 text-brand-sky" />
              Request Assisted Withdrawal
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-text-secondary mb-6">Our support team will prepare this withdrawal for your final confirmation. You must approve it on your profile page before it is sent.</p>
          
          <div className="mb-4">
              <p className="text-sm text-text-secondary">Current Mining Balance</p>
              <p className="text-lg font-semibold flex items-center"><EthereumLogo className="w-5 h-5 mr-2" /> {currentBalance.toFixed(4)} ETH</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="amount-assist" className="block text-sm font-medium text-text-secondary mb-2">Amount to Withdraw</label>
              <div className="relative">
                  <input
                      id="amount-assist"
                      type="number" value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(''); }}
                      placeholder="0.00"
                      className="w-full bg-white/50 border border-white/40 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-text-secondary sm:text-sm">ETH</span></div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <div>
                <label htmlFor="message-assist" className="block text-sm font-medium text-text-secondary mb-2">Message to Support (Optional)</label>
                <textarea
                    id="message-assist"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="e.g., Please process this quickly."
                    className="w-full bg-white/50 border border-white/40 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky"
                />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center p-3 bg-brand-sky hover:bg-brand-sky-light rounded-md transition-colors duration-200 font-bold text-white"
            >
              Send Request to Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAssistanceModal;
