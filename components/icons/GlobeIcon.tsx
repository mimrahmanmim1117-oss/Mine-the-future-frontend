import React from 'react';

export const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 9.75h17.5M9.75 3.25a15.75 15.75 0 014.5 0M9.75 20.75a15.75 15.75 0 004.5 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a15.75 15.75 0 004.5-17.5M12 3a15.75 15.75 0 00-4.5 17.5" />
  </svg>
);
