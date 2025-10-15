
import React, { useState } from 'react';
import type { AppEvent, ChartDataPoint } from '../../types';

interface AdminSiteSettingsProps {
    chartData: ChartDataPoint[];
    events: AppEvent[];
    onChartDataUpdate: (data: ChartDataPoint[]) => void;
    onAddEvent: (event: Omit<AppEvent, 'id'>) => void;
    onUpdateEvent: (event: AppEvent) => void;
    onDeleteEvent: (eventId: string) => void;
}

const emptyEvent: Omit<AppEvent, 'id'> = {
    title: '',
    date: '',
    description: '',
    type: 'announcement',
};

const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({
    chartData,
    events,
    onChartDataUpdate,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
}) => {
    const [newEvent, setNewEvent] = useState(emptyEvent);
    const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
    const [chartDataJson, setChartDataJson] = useState(JSON.stringify(chartData, null, 2));

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            onUpdateEvent(editingEvent);
            setEditingEvent(null);
        } else {
            onAddEvent(newEvent);
            setNewEvent(emptyEvent);
        }
    };
    
    const handleChartDataSave = () => {
        try {
            const data = JSON.parse(chartDataJson);
            onChartDataUpdate(data);
            alert('Chart data updated successfully!');
        } catch (error) {
            alert('Invalid JSON format for chart data.');
        }
    };

    const currentFormData = editingEvent || newEvent;
    const setCurrentFormData = (editingEvent ? setEditingEvent : setNewEvent) as React.Dispatch<React.SetStateAction<any>>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Site Settings</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Chart Data Management */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">Landing Page Chart Data</h2>
                    <p className="text-sm text-slate-600 mb-4">Update the data points for the weekly mining chart. Use valid JSON format.</p>
                    <textarea
                        value={chartDataJson}
                        onChange={(e) => setChartDataJson(e.target.value)}
                        rows={10}
                        className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <button
                        onClick={handleChartDataSave}
                        className="mt-4 bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Save Chart Data
                    </button>
                </div>

                {/* Event Management */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">Manage Events</h2>
                    
                    {/* Event Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4 mb-6 p-4 border border-slate-200 rounded-md bg-slate-50">
                        <h3 className="font-semibold text-slate-800">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                        <input
                            type="text"
                            placeholder="Event Title"
                            value={currentFormData.title}
                            onChange={(e) => setCurrentFormData({ ...currentFormData, title: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                value={currentFormData.date}
                                onChange={(e) => setCurrentFormData({ ...currentFormData, date: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800"
                                required
                            />
                             <select
                                value={currentFormData.type}
                                onChange={(e) => setCurrentFormData({ ...currentFormData, type: e.target.value as AppEvent['type'] })}
                                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800"
                            >
                                <option value="announcement">Announcement</option>
                                <option value="update">Update</option>
                                <option value="milestone">Milestone</option>
                            </select>
                        </div>
                       
                         <textarea
                            placeholder="Short Description (for cards)"
                            rows={3}
                            value={currentFormData.description}
                            onChange={(e) => setCurrentFormData({ ...currentFormData, description: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800"
                            required
                        />
                        <div className="flex space-x-2">
                             <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm">
                                {editingEvent ? 'Update Event' : 'Add Event'}
                            </button>
                            {editingEvent && (
                                <button type="button" onClick={() => setEditingEvent(null)} className="bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm">
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Event List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {events.map(event => (
                            <div key={event.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-200">
                                <div>
                                    <p className="font-semibold text-slate-800">{event.title}</p>
                                    <p className="text-xs text-slate-500">{event.date}</p>
                                </div>
                                <div className="space-x-2 flex-shrink-0">
                                    <button onClick={() => setEditingEvent(event)} className="text-yellow-600 hover:text-yellow-500 text-xs font-semibold">Edit</button>
                                    <button onClick={() => onDeleteEvent(event.id)} className="text-red-600 hover:text-red-500 text-xs font-semibold">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSiteSettings;