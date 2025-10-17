
import React from 'react';

export const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-8.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 11.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v16.5m-3.75-9.75h7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.25 2.25 0 00-2.25 2.25c0 1.312 2.25 4.5 2.25 4.5s2.25-3.188 2.25-4.5A2.25 2.25 0 0012 4.5z" />
  </svg>
);
