import React, { useState, useMemo } from 'react';
import type { Page } from '../types';
import { EthereumLogo } from './icons/EthereumLogo';
import { CopyIcon } from './icons/CopyIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { WalletIcon } from './icons/WalletIcon';
import MiningSuccessModal from './MiningSuccessModal';

const ETH_PRICE_IN_USD = 3500;
const DEPOSIT_ADDRESSES = {
  USDT: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst',
  USDC: '0x9876zyxw5432vuts1098rqpo7654nmlk3210jihg',
};

interface MiningPageProps {
    userWalletBalance: { usdt: number; usdc: number; };
    onStartMining: (amountToConvert: number, fromCurrency: 'USDT' | 'USDC', ethEquivalent: number) => void;
    onNavigate: (page: Page) => void;
}

const MiningPage: React.FC<MiningPageProps> = ({ userWalletBalance, onStartMining, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState<'USDT' | 'USDC'>('USDT');
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const ethEquivalent = useMemo(() => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return '0.0000';
    }
    return (numericAmount / ETH_PRICE_IN_USD).toFixed(4);
  }, [amount]);
  
  const walletBalance = fromCurrency === 'USDT' ? userWalletBalance.usdt : userWalletBalance.usdc;

  const handleCopy = (currency: 'USDT' | 'USDC') => {
    const address = DEPOSIT_ADDRESSES[currency];
    navigator.clipboard.writeText(address).then(() => {
      setCopyStatus({ [currency]: 'Copied!' });
      setTimeout(() => setCopyStatus({}), 2000);
    }, () => {
      setCopyStatus({ [currency]: 'Failed' });
      setTimeout(() => setCopyStatus({}), 2000);
    });
  };

  const handleStartMiningClick = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        setError('Please enter a valid amount.');
        return;
    }
    if (numericAmount > walletBalance) {
        setError(`Insufficient ${fromCurrency} balance.`);
        return;
    }
    
    const ethValue = parseFloat(ethEquivalent);
    onStartMining(numericAmount, fromCurrency, ethValue);
    setShowSuccessModal(true);
  };

  return (
    <>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2 text-slate-900">Start Mining</h1>
        <p className="text-slate-600 mb-8">Convert your stablecoins to ETH and begin your mining journey.</p>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side: Wallet + Converter */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 space-y-6 flex flex-col border-t-4 border-brand-blue">
                <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center text-slate-900"><WalletIcon className="w-6 h-6 mr-3 text-brand-blue" /> Your Connected Wallet</h2>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div>
                        <p className="text-sm text-slate-500">USDT Balance</p>
                        <p className="text-xl font-semibold text-slate-800">{userWalletBalance.usdt.toLocaleString('en-US')}</p>
                        </div>
                        <div>
                        <p className="text-sm text-slate-500">USDC Balance</p>
                        <p className="text-xl font-semibold text-slate-800">{userWalletBalance.usdc.toLocaleString('en-US')}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Use this balance for instant conversion below.</p>
                </div>

                <div className="border-t border-slate-200 my-6"></div>

                <div className="flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Convert to ETH</h2>
                    <div className="flex mb-4 border border-slate-300 rounded-lg p-1 bg-slate-100 max-w-xs">
                        {(['USDT', 'USDC'] as const).map(currency => (
                        <button
                            key={currency}
                            onClick={() => { setFromCurrency(currency); setError(''); }}
                            className={`w-full py-2 rounded-md font-semibold transition-colors ${fromCurrency === currency ? 'bg-brand-blue text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                        >
                            {currency}
                        </button>
                        ))}
                    </div>
                    <div className="space-y-6 flex-grow flex flex-col">
                        <div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-2">Amount to convert</label>
                                <span className="text-sm text-slate-500">Balance: {walletBalance.toLocaleString()} {fromCurrency}</span>
                            </div>
                            <div className="relative">
                                <input
                                    id="amount" type="number" value={amount}
                                    onChange={(e) => { setAmount(e.target.value); setError(''); }}
                                    placeholder="1000.00"
                                    className="w-full bg-slate-100 border border-slate-300 rounded-md px-4 py-3 text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><span className="text-slate-500 font-semibold">{fromCurrency}</span></div>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="w-full h-px bg-slate-200"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mx-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                            <div className="w-full h-px bg-slate-200"></div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">You will receive (approx.)</label>
                            <div className="relative">
                                <div className="w-full bg-slate-100 border border-slate-300 rounded-md px-4 py-3 text-slate-900 text-lg">{ethEquivalent}</div>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><EthereumLogo className="w-5 h-5 mr-2" /><span className="text-slate-500 font-semibold">ETH</span></div>
                            </div>
                        </div>
                        <div className="flex-grow"></div>
                        <button
                            onClick={handleStartMiningClick}
                            className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg text-lg disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={!amount || parseFloat(amount) <= 0}
                        >Start Mining with {ethEquivalent} ETH</button>
                    </div>
                </div>
            </div>

            {/* Right Side: Deposit Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 border-t-4 border-brand-blue">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Alternative: Deposit Manually</h2>
                <p className="text-slate-600 mb-6 text-sm">If you prefer, you can send funds to an address below. Your balance will update after network confirmation.</p>
                <div className="space-y-6">
                    {(['USDT', 'USDC'] as const).map(currency => (
                    <div key={currency}>
                        <h3 className="font-semibold text-lg mb-2 text-slate-800">{currency} Deposit Address</h3>
                        <div className="flex items-center space-x-2">
                        <input type="text" readOnly value={DEPOSIT_ADDRESSES[currency]} className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-500 text-sm font-mono focus:outline-none truncate" />
                        <button onClick={() => handleCopy(currency)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-3 rounded-md transition-colors flex items-center" title={`Copy ${currency} Address`}>
                            <CopyIcon className="w-5 h-5"/>
                        </button>
                        <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium p-2 rounded-md transition-colors" title="Show QR Code">
                            <QrCodeIcon className="w-5 h-5"/>
                        </button>
                        </div>
                        {copyStatus[currency] && <p className="text-green-600 text-xs mt-2">{copyStatus[currency]}</p>}
                        <p className="text-xs text-yellow-600 mt-2">Send only {currency} (ERC-20) to this address.</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
        {showSuccessModal && (
            <MiningSuccessModal 
                ethAmount={ethEquivalent}
                onClose={() => setShowSuccessModal(false)}
                onNavigateToProfile={() => onNavigate('profile')}
            />
        )}
    </>
  );
};

export default MiningPage;