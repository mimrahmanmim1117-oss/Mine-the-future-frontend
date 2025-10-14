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
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-brand-dark-light rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TransferIcon className="w-6 h-6 mr-3 text-brand-blue" />
            Transfer Assets
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>
        <p className="text-brand-gray mb-6">Transfer ETH from your mining balance to your connected wallet.</p>
        
        <div className="mb-4">
            <p className="text-sm text-brand-gray">Current Mining Balance</p>
            <p className="text-lg font-semibold flex items-center"><EthereumLogo className="w-5 h-5 mr-2" /> {currentBalance.toFixed(4)} ETH</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-brand-gray mb-2">Amount to Transfer</label>
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
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    aria-describedby="eth-addon"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-brand-gray sm:text-sm" id="eth-addon">ETH</span>
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
        <p className="text-xs text-brand-gray mt-6 text-center">Transfers are processed on the Ethereum network and may incur gas fees.</p>
      </div>
    </div>
  );
};

export default TransferAssetsModal;