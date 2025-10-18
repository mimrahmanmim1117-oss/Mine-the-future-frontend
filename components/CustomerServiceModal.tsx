import React from 'react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { TelegramIcon } from './icons/TelegramIcon';

interface CustomerServiceModalProps {
  onClose: () => void;
  onLiveChatClick: () => void;
  telegramUrl: string;
}

const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({ onClose, onLiveChatClick, telegramUrl }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white/50 backdrop-blur-xl text-text-primary rounded-lg shadow-2xl max-w-sm w-full border border-white/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-white/30 border-b border-white/30">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Customer Service</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors text-3xl leading-none">&times;</button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-text-secondary mb-6">How can we help you today? Choose your preferred method of contact.</p>
          <div className="space-y-4">
            <button
              onClick={onLiveChatClick}
              className="w-full flex items-center p-4 bg-white/40 hover:bg-white/60 rounded-md transition-colors duration-200 text-left"
            >
              <ChatBubbleIcon className="w-8 h-8 mr-4 text-brand-sky" />
              <div>
                <span className="font-medium text-text-primary">Live Chat</span>
                <p className="text-sm text-text-secondary">Chat with a support agent now</p>
              </div>
            </button>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center p-4 bg-white/40 hover:bg-white/60 rounded-md transition-colors duration-200"
            >
              <TelegramIcon className="w-8 h-8 mr-4 text-blue-500" />
               <div>
                <span className="font-medium text-text-primary">Telegram Support</span>
                <p className="text-sm text-text-secondary">Contact us on Telegram</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceModal;