import React from 'react';

const ItalicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75l3 16.5M5.25 3.75h9.75M9 20.25h9.75" />
  </svg>
);

export default ItalicIcon;
