import React from 'react';

export const ZenGoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="12" fill="#1A1A2E"/>
    <path d="M8 8L12 12M12 12L16 16M12 12L8 16M12 12L16 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);