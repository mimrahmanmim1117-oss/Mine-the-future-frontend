import React from 'react';

export const WifiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.136 11.886a9.75 9.75 0 0113.728 0M2 8.734a14.25 14.25 0 0120 0M12 20.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);
