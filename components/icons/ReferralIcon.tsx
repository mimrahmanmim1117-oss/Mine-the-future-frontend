import React from 'react';

export const ReferralIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.404 0l-1.933 1.934c-.326.326-.855.326-1.182 0l-1.933-1.934a3.75 3.75 0 015.404 0zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75A2.25 2.25 0 019.75 15m0-4.5A2.25 2.25 0 0112 8.25m0 4.5A2.25 2.25 0 0114.25 15m0-4.5A2.25 2.25 0 0112 8.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18.75a9.094 9.094 0 013.741-.479 3 3 0 014.682-2.72M6 18.75V12a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0112 12v6.75" />
  </svg>
);
