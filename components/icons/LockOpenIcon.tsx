import React from 'react';

export const LockOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M10.5 10.5H13.5m-3 11.25h3.375c.621 0 1.125-.504 1.125-1.125V18.375m-8.25 3.375h3.375c.621 0 1.125-.504 1.125-1.125V18.375m-8.25 3.375c0-.621.504-1.125 1.125-1.125H6.75" />
  </svg>
);
