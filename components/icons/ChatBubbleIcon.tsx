import React from 'react';

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.372a3.527 3.527 0 01-3.296-2.027l-1.423-3.873-.827-2.257a3.527 3.527 0 01-2.027-3.296l.372-3.721c.093-1.133.957-1.98 2.09-1.98h4.286c.97 0 1.813.616 2.097 1.5z"
    />
  </svg>
);