import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';

interface LiveChatProps {
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ onClose, messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm h-[60vh] flex flex-col z-50">
      <div className="bg-white/50 backdrop-blur-xl rounded-lg shadow-2xl border border-white/30 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-white/30 border-b border-white/30 flex justify-between items-center flex-shrink-0">
          <h3 className="font-bold text-lg text-text-primary">Live Support</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors text-3xl leading-none">&times;</button>
        </div>
        
        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-brand-sky text-white rounded-br-none' : 'bg-white/60 text-text-primary rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white/30 border-t border-white/30 flex-shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-white/50 border border-white/40 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky"
            />
            <button type="submit" className="bg-brand-sky hover:bg-brand-sky-light text-white font-bold py-2 px-4 rounded-md transition-colors">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;