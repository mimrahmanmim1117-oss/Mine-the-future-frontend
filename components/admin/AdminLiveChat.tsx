import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { ChatSession, Message } from '../../types';
import { PaperAirplaneIcon } from '../icons/PaperAirplaneIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';

interface AdminLiveChatProps {
    sessions: Record<string, ChatSession>;
    onSendMessage: (sessionId: string, text: string) => void;
    onReadMessage: (sessionId: string) => void;
}

const AdminLiveChat: React.FC<AdminLiveChatProps> = ({ sessions, onSendMessage, onReadMessage }) => {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sortedSessions = useMemo(() => {
        return Object.values(sessions).sort((a: ChatSession, b: ChatSession) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
    }, [sessions]);
    
    // Automatically select the first session if none is selected
    useEffect(() => {
        if (!selectedSessionId && sortedSessions.length > 0) {
            setSelectedSessionId(sortedSessions[0].sessionId);
        }
    }, [sortedSessions, selectedSessionId]);

    const selectedSession = selectedSessionId ? sessions[selectedSessionId] : null;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedSession?.messages]);
    
    useEffect(() => {
        // Only mark as read if the session is selected and has unread messages.
        // This prevents an infinite loop caused by the onReadMessage callback
        // changing on every render.
        if (selectedSessionId && sessions[selectedSessionId]?.unreadAdmin) {
            onReadMessage(selectedSessionId);
        }
    }, [selectedSessionId, sessions, onReadMessage]);

    const handleSelectSession = (sessionId: string) => {
        setSelectedSessionId(sessionId);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && selectedSessionId) {
            onSendMessage(selectedSessionId, inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-lg shadow-sm border border-slate-200">
            {/* Session List */}
            <aside className="w-1/3 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 flex-shrink-0">
                    <h2 className="font-semibold text-lg text-slate-800">Conversations</h2>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {sortedSessions.length > 0 ? sortedSessions.map(session => (
                        <button
                            key={session.sessionId}
                            onClick={() => handleSelectSession(session.sessionId)}
                            className={`w-full text-left p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors ${selectedSessionId === session.sessionId ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm text-slate-800 truncate" title={session.sessionId}>
                                    {`${session.sessionId.substring(0, 8)}...${session.sessionId.substring(session.sessionId.length - 6)}`}
                                </p>
                                {session.unreadAdmin && (
                                    <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 ml-2"></span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">
                                {session.messages[session.messages.length - 1]?.text || 'No messages yet'}
                            </p>
                        </button>
                    )) : (
                        <p className="p-4 text-sm text-slate-500">No active conversations.</p>
                    )}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="w-2/3 flex flex-col">
                {selectedSession ? (
                    <>
                        <div className="p-4 border-b border-slate-200 flex items-center flex-shrink-0">
                            <UserCircleIcon className="w-8 h-8 mr-3 text-slate-400" />
                            <div>
                                <h3 className="font-semibold text-slate-900">{`${selectedSession.sessionId.substring(0, 10)}...`}</h3>
                                <p className="text-xs text-green-600">Online</p>
                            </div>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
                            {selectedSession.messages.map((msg, index) => (
                                <div key={`${msg.timestamp}-${index}`} className={`flex items-end gap-2 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-lg rounded-lg px-4 py-2 shadow-sm ${msg.sender === 'admin' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message to the user..."
                                    className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                />
                                <button type="submit" className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center">
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Select a conversation to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminLiveChat;