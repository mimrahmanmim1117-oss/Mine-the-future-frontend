import React from 'react';

export const EthereumLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M11.944 17.97L4.58 12.42l7.364 11.28 7.364-11.28-7.364 5.55z" />
    <path d="M12.056 2.31L4.58 11.23l7.476-4.42 7.276 4.42-7.276-8.92z" />
  </svg>
);