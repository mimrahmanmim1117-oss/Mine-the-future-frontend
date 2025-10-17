import React, { useState, useEffect, useCallback } from 'react';
import type { AppEvent } from '../../types';
import * as api from './api';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const initialFormState: Omit<AppEvent, 'id'> = {
    title: '',
    date: '',
    description: '',
    type: 'announcement',
};

const AdminEventManagement: React.FC = () => {
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await api.fetchEvents();
            setEvents(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            if (editingId) {
                await api.updateEvent({ ...formData, id: editingId });
            } else {
                await api.addEvent(formData);
            }
            setFormData(initialFormState);
            setEditingId(null);
            await fetchEvents();
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleEdit = (event: AppEvent) => {
        setEditingId(event.id);
        setFormData({
            title: event.title,
            date: event.date,
            description: event.description,
            type: event.type,
        });
    };

    const handleDelete = async (eventId: string) => {
        if(window.confirm("Are you sure you want to delete this event?")) {
            try {
                await api.deleteEvent(eventId);
                await fetchEvents();
            } catch (err) {
                setError(err as Error);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-900">{editingId ? "Edit Event" : "Create New Event"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">Event Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">Event Date</label>
                        <input type="date" name="date" id="date" value={formData.date} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-slate-600 mb-1">Event Type</label>
                        <select name="type" id="type" value={formData.type} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                            <option value="announcement">Announcement</option>
                            <option value="update">Update</option>
                            <option value="milestone">Milestone</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} required className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"></textarea>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-slate-400">
                            {isSubmitting ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}
                        </button>
                        {editingId && <button type="button" onClick={handleCancelEdit} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors">Cancel</button>}
                    </div>
                </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                 <h2 className="text-xl font-semibold mb-4 text-slate-900">Scheduled Events</h2>
                 <div className="space-y-4">
                    {events.length > 0 ? events.map(event => (
                        <div key={event.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-800">{event.title}</p>
                                    <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()} - <span className="capitalize font-medium">{event.type}</span></p>
                                    <p className="text-sm text-slate-600 mt-2">{event.description}</p>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 ml-4">
                                    <button onClick={() => handleEdit(event)} className="text-sm text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(event.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-slate-500">No events found.</p>}
                 </div>
            </div>
        </div>
    );
};

export default AdminEventManagement;
