import React from 'react';

export const BybitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="12" fill="black"/>
    <circle cx="12" cy="12" r="6" fill="url(#bybit-gradient)"/>
    <defs>
      <linearGradient id="bybit-gradient" x1="6" y1="6" x2="18" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F7931A"/>
        <stop offset="1" stopColor="#F0B90B"/>
      </linearGradient>
    </defs>
  </svg>
);