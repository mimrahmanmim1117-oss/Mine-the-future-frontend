import React from 'react';

interface FooterProps {
  isConnected: boolean;
  onDisconnect: () => void;
}

const Footer: React.FC<FooterProps> = ({ isConnected, onDisconnect }) => {
  return (
    <footer className="bg-white/20 backdrop-blur-lg border-t border-white/30 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-text-secondary">&copy; {new Date().getFullYear()} ETH Mining Nexus. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {isConnected ? (
              <button onClick={onDisconnect} className="text-text-secondary hover:text-brand-sky transition-colors">
                Disconnect
              </button>
            ) : (
              <a href="mailto:support@ethminingnexus.com" className="text-text-secondary hover:text-brand-sky transition-colors">Customer Service</a>
            )}
            <a href="#" className="text-text-secondary hover:text-brand-sky transition-colors">Terms of Service</a>
            <a href="#" className="text-text-secondary hover:text-brand-sky transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-secondary hover:text-brand-sky transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;