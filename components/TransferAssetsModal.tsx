import React, { useState } from 'react';
import { TransferIcon } from './icons/TransferIcon';
import { EthereumLogo } from './icons/EthereumLogo';

interface TransferAssetsModalProps {
  onClose: () => void;
  onTransfer: (amount: number) => void;
  currentBalance: number;
}

const TransferAssetsModal: React.FC<TransferAssetsModalProps> = ({ onClose, onTransfer, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (numericAmount > currentBalance) {
      setError('Insufficient balance.');
      return;
    }
    onTransfer(numericAmount);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <TransferIcon className="w-6 h-6 mr-3 text-brand-blue" />
              Transfer Assets
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-slate-600 mb-6">Transfer ETH from your mining balance to your connected wallet.</p>
          
          <div className="mb-4">
              <p className="text-sm text-slate-500">Current Mining Balance</p>
              <p className="text-lg font-semibold flex items-center"><EthereumLogo className="w-5 h-5 mr-2" /> {currentBalance.toFixed(4)} ETH</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-2">Amount to Transfer</label>
              <div className="relative">
                  <input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                          setAmount(e.target.value);
                          setError('');
                      }}
                      placeholder="0.00"
                      className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      aria-describedby="eth-addon"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm" id="eth-addon">ETH</span>
                  </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              onClick={handleTransfer}
              className="w-full flex items-center justify-center p-3 bg-brand-blue hover:bg-brand-blue-light rounded-md transition-colors duration-200 font-semibold text-white"
            >
              Confirm Transfer
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-6 text-center">Transfers are processed on the Ethereum network and may incur gas fees.</p>
        </div>
      </div>
    </div>
  );
};

export default TransferAssetsModal;