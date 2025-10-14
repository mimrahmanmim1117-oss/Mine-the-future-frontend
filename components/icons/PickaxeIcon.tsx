
import React from 'react';

export const PickaxeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.415a1.875 1.875 0 012.652 0l.415.415a1.875 1.875 0 010 2.652l-6.364 6.364a1.875 1.875 0 01-2.652 0l-.415-.415a1.875 1.875 0 010-2.652L8.25 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l4.5 4.5M12 7.5l6 6M3 12h6.375M3.75 16.5h16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3.75m0 14.25V21" />
  </svg>
);
