import React from 'react';

const BoldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4.5h8.25a3.75 3.75 0 010 7.5H4.5v-7.5zm0 7.5h9a3.75 3.75 0 010 7.5H4.5v-7.5z" />
  </svg>
);

export default BoldIcon;
