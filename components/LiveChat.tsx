import React, { useState, useEffect, useRef } from 'react';

interface LiveChatProps {
  onClose: () => void;
}

interface Message {
  text: string;
  sender: 'user' | 'support';
}

const LiveChat: React.FC<LiveChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", sender: 'support' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = { 
        text: "Thank you for your message. An agent will be with you shortly. Please provide any relevant details, such as transaction IDs or wallet addresses.", 
        sender: 'support' 
      };
      setIsTyping(false);
      setMessages(prev => [...prev, supportResponse]);
    }, 2000);
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
          {isTyping && (
             <div className="flex items-end gap-2 justify-start">
              <div className="bg-white/60 text-text-primary rounded-lg px-4 py-2 rounded-bl-none">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
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