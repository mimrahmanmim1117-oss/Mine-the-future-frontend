import React from 'react';

interface GearDescriptionModalProps {
  onClose: () => void;
  description: string;
}

const GearDescriptionModal: React.FC<GearDescriptionModalProps> = ({ onClose, description }) => {
  // A simple utility to convert markdown-like ### and --- to HTML
  const formatDescription = (text: string) => {
    return text
      .replace(/### (.*)/g, '<h3 class="text-lg font-bold text-text-primary mt-4 mb-2">$1</h3>')
      .replace(/####\s?(.*)/g, '<h4 class="text-md font-bold text-text-primary mt-3 mb-1">$1</h4>')
      .replace(/---/g, '<hr class="my-4 border-white/40" />')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200/50 text-sm font-mono px-1 py-0.5 rounded">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white/50 backdrop-blur-xl text-text-primary rounded-lg shadow-2xl max-w-2xl w-full border border-white/30 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-white/30 border-b border-white/30">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Gear Income Ratio Description</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors text-3xl leading-none">&times;</button>
          </div>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: formatDescription(description) }} />
        </div>
      </div>
    </div>
  );
};

export default GearDescriptionModal;
