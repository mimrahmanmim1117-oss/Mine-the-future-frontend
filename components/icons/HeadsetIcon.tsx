import React from 'react';

export const HeadsetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    {...props}
  >
    <g fill="none" stroke="#4b5563" strokeWidth="1.2">
      {/* Head */}
      <path d="M12,14 C14.7614237,14 17,11.7614237 17,9 C17,6.23857625 14.7614237,4 12,4 C9.23857625,4 7,6.23857625 7,9 C7,11.7614237 9.23857625,14 12,14 Z" fill="#f0e6ef"/>
      {/* Hair */}
      <path d="M16,9.5 C16,7.5 14,6 12,6 C10,6 8,7.5 8,9.5" fill="#9ca3af"/>
      {/* Neck */}
      <path strokeLinecap="round" d="M10.5 13.5v2a1.5 1.5 0 003 0v-2"/>
      {/* Headphones */}
      <path d="M5,13a7,7 0,0,1,14,0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      <rect x="4" y="11" width="3" height="5" rx="1.5" fill="#3b82f6"/>
      <rect x="17" y="11" width="3" height="5" rx="1.5" fill="#3b82f6"/>
      {/* Mic */}
      <path strokeLinecap="round" d="M9.5 15v1.5a2.5 2.5 0 005 0V15"/>
       {/* Smile */}
      <path strokeLinecap="round" d="M10.5,10.5 Q12,11.5 13.5,10.5"/>
       {/* Bubble */}
      <g transform="translate(15.5 1.5)">
        <path d="M4.5,0 C6.98528137,0 9,2.01471863 9,4.5 C9,6.98528137 6.98528137,9 4.5,9 C3.375,9 2.34975,8.578125 1.546875,7.875 L0,9 L0,4.5 C0,2.01471863 2.01471863,0 4.5,0 Z" fill="#fff"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 3v2 M4.5 6h.01"/>
      </g>
    </g>
  </svg>
);