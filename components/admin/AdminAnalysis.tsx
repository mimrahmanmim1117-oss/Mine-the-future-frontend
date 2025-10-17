import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { AppEvent, ChartDataPoint } from '../../types';
import * as api from './api';
import ErrorDisplay from './ErrorDisplay';
import LoadingSpinner from './LoadingSpinner';

const AdminAnalysis: React.FC = () => {
    const [analysis, setAnalysis] = useState<string>('');
    const [error, setError] = useState<Error | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    
    const handleGenerateAnalysis = async () => {
        setIsGenerating(true);
        setError(null);
        setAnalysis('');

        try {
            // First, fetch the latest data from our "backend"
            const { chartData, events } = await api.fetchSiteSettings();

            if (!chartData || chartData.length === 0) {
                throw new Error("No chart data available to analyze. Please generate chart data first.");
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const prompt = `
                As an expert crypto market analyst, provide a brief analysis based on the following data for an ETH mining platform admin.
                Your tone should be professional, insightful, and concise. Use markdown for formatting.

                **Current Market Data (Fictional):**
                - The chart shows price points over the last ${chartData.length} days.
                - Start Price: $${chartData[0].value.toFixed(2)}
                - End Price: $${chartData[chartData.length - 1].value.toFixed(2)}
                - Highest Price: $${Math.max(...chartData.map(p => p.value)).toFixed(2)}
                - Lowest Price: $${Math.min(...chartData.map(p => p.value)).toFixed(2)}

                **Upcoming Scheduled Events:**
                ${events.length > 0 ? events.map(e => `- ${e.date}: ${e.title} (${e.type}) - ${e.description}`).join('\n') : "No upcoming events."}

                **Your Task:**
                1.  **Market Trend Summary:** Briefly describe the overall trend shown in the chart data (e.g., bullish, bearish, volatile, stable).
                2.  **Key Price Levels:** Identify any potential support or resistance levels based on the highs and lows.
                3.  **Event Impact Analysis:** Speculate on how the upcoming events might impact user sentiment and platform activity. For example, a "System Upgrade" might build confidence, while a "New Referral Program" could drive user growth.
                4.  **Overall Outlook:** Conclude with a short, overall strategic outlook.
            `;

            const response = await ai.models.generateContentStream({
               model: "gemini-2.5-flash",
               contents: prompt,
            });

            for await (const chunk of response) {
                setAnalysis(prev => prev + chunk.text);
            }

        } catch (err) {
            console.error("Gemini API error:", err);
            setError(err instanceof Error ? err : new Error('Failed to generate analysis. Check API key and backend connection.'));
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h2 className="text-xl font-semibold text-slate-900">AI-Powered Market Analysis</h2>
                <p className="text-sm text-slate-600 mt-1 mb-4">
                    Generate an analysis of the current market data and upcoming events to gain strategic insights.
                </p>
                <button
                    onClick={handleGenerateAnalysis}
                    disabled={isGenerating}
                    className="bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'Generating...' : 'Generate Analysis'}
                </button>
            </div>

            {error && <ErrorDisplay error={error} />}

            {isGenerating && !analysis && <LoadingSpinner />}
            
            {analysis && (
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Analysis Results</h3>
                    <div 
                        className="prose prose-slate max-w-none" 
                        dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminAnalysis;
