
import React from 'react';

export const TrezorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="12" fill="#1B1B1B"/>
    <path d="M12 4L4 8V16L12 20L20 16V8L12 4ZM12 6.23L17.5 9.53V14.47L12 17.77L6.5 14.47V9.53L12 6.23Z" fill="white"/>
  </svg>
);
