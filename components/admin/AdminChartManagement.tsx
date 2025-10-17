import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import type { ChartDataPoint } from '../../types';
import * as api from './api';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { TrashIcon } from '../icons/TrashIcon';

const AdminChartManagement: React.FC = () => {
    const [editableChartData, setEditableChartData] = useState<ChartDataPoint[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const fetchChart = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await api.fetchChartData();
            setEditableChartData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChart();
    }, [fetchChart]);

    const handleGenerateNewData = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const lastValue = editableChartData.length > 0 ? editableChartData[editableChartData.length - 1].value : 3500;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: `Generate a realistic but fictional daily Ethereum price chart for the next 30 days, starting from today. The last known price was around $${lastValue.toFixed(2)}. The data should show plausible market volatility, including small dips and rises. Provide the data as a JSON array of objects, where each object has a "name" (e.g., "Oct 1", "Oct 2") and a "value" (a number representing the price). Do not include any explanatory text, just the raw JSON array.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                value: { type: Type.NUMBER },
                            },
                            required: ["name", "value"],
                        },
                    },
                },
            });

            const newJsonData = JSON.parse(response.text);
            
            if (Array.isArray(newJsonData) && newJsonData.every(item => 'name' in item && 'value' in item)) {
                 setEditableChartData(newJsonData); // Update editor, but don't save yet
            } else {
                throw new Error("Generated data is not in the expected format.");
            }

        } catch (err) {
            console.error("Gemini API error:", err);
            setError(err instanceof Error ? err : new Error('Failed to generate new chart data. Check API key and configuration.'));
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handlePointChange = (index: number, field: 'name' | 'value', value: string | number) => {
        const newData = [...editableChartData];
        if (field === 'value') {
            newData[index] = { ...newData[index], value: Number(value) };
        } else {
            newData[index] = { ...newData[index], name: String(value) };
        }
        setEditableChartData(newData);
    };

    const handleAddPoint = () => {
        setEditableChartData([...editableChartData, { name: `Day ${editableChartData.length + 1}`, value: editableChartData.length > 0 ? editableChartData[editableChartData.length -1].value : 3000 }]);
    };
    
    const handleRemovePoint = (index: number) => {
        setEditableChartData(editableChartData.filter((_, i) => i !== index));
    };
    
    const handleSaveChanges = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await api.updateChartData(editableChartData);
            alert("Chart data saved successfully!");
        } catch (err) {
             setError(err as Error);
        } finally {
            setIsSaving(false);
        }
    };

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error && !isSaving && !isGenerating) return <ErrorDisplay error={error} />;

        return (
             <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">Live Chart Preview</h2>
                    <div className="w-full h-96">
                        {editableChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={editableChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" stroke="#64748b" />
                                    <YAxis stroke="#64748b" domain={['dataMin - 50', 'dataMax + 50']} tickFormatter={(val) => `$${Number(val).toLocaleString()}`} />
                                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#1e293b' }} formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} />
                                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 8, stroke: '#2563eb', fill: '#fff' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="flex items-center justify-center h-full text-slate-500">No chart data. Add a point to begin.</div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Edit Chart Data</h2>
                    <p className="text-sm text-slate-500 mt-1 mb-4">
                        Add, remove, or edit points. The chart will update live.
                    </p>

                     {error && <div className="mb-4"><ErrorDisplay error={error} /></div>}

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 border-y border-slate-200 py-4">
                        {editableChartData.map((point, index) => (
                            <div key={index} className="grid grid-cols-10 gap-2 items-center">
                                <input 
                                    type="text"
                                    value={point.name}
                                    onChange={(e) => handlePointChange(index, 'name', e.target.value)}
                                    placeholder="Label"
                                    className="col-span-4 bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                />
                                <input 
                                    type="number"
                                    value={point.value}
                                    onChange={(e) => handlePointChange(index, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="col-span-5 bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                />
                                <button onClick={() => handleRemovePoint(index)} className="col-span-1 text-slate-400 hover:text-red-600 transition-colors flex justify-center">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                        <button onClick={handleAddPoint} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors text-sm">
                            Add Point
                        </button>
                        <button
                            onClick={handleGenerateNewData}
                            disabled={isGenerating}
                            className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 px-4 rounded-md transition-colors text-sm disabled:opacity-50"
                        >
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-slate-400"
                        >
                            {isSaving ? 'Saving...' : 'Save Chart Data'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
           {renderContent()}
        </div>
    );
};

export default AdminChartManagement;
