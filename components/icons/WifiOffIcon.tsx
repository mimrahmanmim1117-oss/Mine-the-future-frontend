import React from 'react';

export const WifiOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25l19.5 19.5M8.288 15.038a5.25 5.25 0 017.424 0M5.136 11.886c3.87-3.87 10.158-3.87 14.028 0M2 8.734c5.206-5.206 13.694-5.206 18.9 0" />
  </svg>
);
