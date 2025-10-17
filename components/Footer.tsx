
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-slate-500">&copy; {new Date().getFullYear()} ETH Mining Nexus. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="mailto:support@ethminingnexus.com" className="text-slate-500 hover:text-brand-blue transition-colors">Customer Service</a>
            <a href="#" className="text-slate-500 hover:text-brand-blue transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-brand-blue transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-brand-blue transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;