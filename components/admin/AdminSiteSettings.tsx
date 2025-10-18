import React, { useState, useEffect } from 'react';
import * as api from './api';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import type { SiteSettings, GearRatio } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';

const AdminSiteSettings: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchSettings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await api.fetchSiteSettings();
            setSettings(result);
        } catch(err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
      };
      fetchSettings();
    }, []);

    const handleSettingChange = (field: keyof SiteSettings, value: any) => {
        setSettings(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleGearChange = (index: number, field: keyof GearRatio, value: string | number) => {
        if (!settings) return;
        const newGears = [...settings.gearRatios];
        const gearToUpdate = { ...newGears[index], [field]: value };
        newGears[index] = gearToUpdate;
        handleSettingChange('gearRatios', newGears);
    };

    const handleAddGear = () => {
        if (!settings) return;
        const newGear: GearRatio = {
            id: `g${Date.now()}`,
            gear: settings.gearRatios.length + 1,
            quantity: '0 ~ 0',
            rateOfReturn: '0.0000 ~ 0.0000',
            revenueUnit: 'ETH',
        };
        handleSettingChange('gearRatios', [...settings.gearRatios, newGear]);
    };

    const handleRemoveGear = (index: number) => {
        if (!settings) return;
        const newGears = settings.gearRatios.filter((_, i) => i !== index);
        handleSettingChange('gearRatios', newGears);
    };

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        setError(null);
        try {
            await api.updateSiteSettings(settings);
            alert('Settings saved successfully!');
        } catch(err) {
            setError(err as Error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;
    if (!settings) return null;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Gemini API Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-1 text-slate-900">Gemini API Configuration</h2>
                <p className="text-sm text-slate-500 mb-4">Enter your Gemini API key to enable the AI Market Analysis feature. You can get your key from Google AI Studio.</p>
                <div>
                    <label htmlFor="gemini-key" className="block text-sm font-medium text-slate-600 mb-2">Gemini API Key</label>
                    <input
                        id="gemini-key"
                        type="password"
                        value={settings.geminiApiKey}
                        onChange={(e) => handleSettingChange('geminiApiKey', e.target.value)}
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
                        value={settings.masterWalletAddress}
                        onChange={(e) => handleSettingChange('masterWalletAddress', e.target.value)}
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
                        value={settings.supportTelegramUrl}
                        onChange={(e) => handleSettingChange('supportTelegramUrl', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            {/* Gear Income Ratio Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                 <h2 className="text-xl font-semibold mb-1 text-slate-900">Gear Income Ratio Settings</h2>
                <p className="text-sm text-slate-500 mb-4">Manage the income tiers displayed on the landing page.</p>

                <div className="space-y-2 mb-4">
                    {settings.gearRatios.map((gear, index) => (
                        <div key={gear.id} className="grid grid-cols-12 gap-2 items-center">
                             <input type="number" value={gear.gear} onChange={e => handleGearChange(index, 'gear', e.target.value)} className="col-span-1 bg-slate-50 border border-slate-300 rounded-md p-2 text-sm" />
                             <input type="text" value={gear.quantity} onChange={e => handleGearChange(index, 'quantity', e.target.value)} placeholder="e.g., 10 ~ 1000" className="col-span-4 bg-slate-50 border border-slate-300 rounded-md p-2 text-sm" />
                             <input type="text" value={gear.rateOfReturn} onChange={e => handleGearChange(index, 'rateOfReturn', e.target.value)} placeholder="e.g., 0.0050 ~ 0.0060" className="col-span-4 bg-slate-50 border border-slate-300 rounded-md p-2 text-sm" />
                             <input type="text" value={gear.revenueUnit} onChange={e => handleGearChange(index, 'revenueUnit', e.target.value)} className="col-span-2 bg-slate-50 border border-slate-300 rounded-md p-2 text-sm" />
                             <button onClick={() => handleRemoveGear(index)} className="col-span-1 text-slate-400 hover:text-red-500 flex justify-center items-center"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddGear} className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-2 px-4 rounded-md transition-colors">Add Gear Tier</button>
            
                <div className="mt-6">
                    <label htmlFor="gear-description" className="block text-sm font-medium text-slate-600 mb-2">Gear Ratio Description (Supports Markdown)</label>
                    <textarea 
                        id="gear-description"
                        rows={10}
                        value={settings.gearRatioDescription}
                        onChange={(e) => handleSettingChange('gearRatioDescription', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                 <div className="text-sm">
                    <span className="font-semibold">System Status: </span>
                    <span className="text-green-600 font-bold">Operational</span>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-6 rounded-md transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>
        </div>
    );
};

export default AdminSiteSettings;
