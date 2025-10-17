import React, { useState, useEffect } from 'react';
import * as api from './api';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const AdminSiteSettings: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // Mock settings state
    const [apiKey, setApiKey] = useState('');
    const [masterWallet, setMasterWallet] = useState('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
    const [supportTelegram, setSupportTelegram] = useState('https://t.me/CryptoSupport');

    // In a real app, you would fetch these settings.
    // useEffect(() => {
    //   const fetchSettings = async () => { ... };
    //   fetchSettings();
    // }, []);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate saving settings
        setTimeout(() => {
            console.log('Settings Saved:', { apiKey, masterWallet, supportTelegram });
            setIsLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    if (error) return <ErrorDisplay error={error} />;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Gemini API Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-1 text-slate-900">Gemini API Configuration</h2>
                <p className="text-sm text-slate-500 mb-4">Enter your Gemini API key to enable the AI Market Analysis feature. You can get your key from Google AI Studio.</p>
                <div>
                    <label htmlFor="gemini-key" className="block text-sm font-medium text-slate-600 mb-2">Gemini API Key</label>
                    <input
                        id="gemini-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            {/* Withdrawal Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-1 text-slate-900">Withdrawal Configuration</h2>
                <p className="text-sm text-slate-500 mb-4">Set the master wallet address for processing user withdrawals.</p>
                <div>
                    <label htmlFor="master-wallet" className="block text-sm font-medium text-slate-600 mb-2">Master Withdrawal Wallet Address</label>
                    <input
                        id="master-wallet"
                        type="text"
                        value={masterWallet}
                        onChange={(e) => setMasterWallet(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            {/* Support Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-1 text-slate-900">Support Configuration</h2>
                <p className="text-sm text-slate-500 mb-4">Set the customer service Telegram account link.</p>
                <div>
                    <label htmlFor="telegram-support" className="block text-sm font-medium text-slate-600 mb-2">Customer Service Telegram Account</label>
                    <input
                        id="telegram-support"
                        type="text"
                        value={supportTelegram}
                        onChange={(e) => setSupportTelegram(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center">
                 <div className="text-sm">
                    <span className="font-semibold">System Status: </span>
                    <span className="text-green-600 font-bold">Operational</span>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-6 rounded-md transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>
        </div>
    );
};

export default AdminSiteSettings;
