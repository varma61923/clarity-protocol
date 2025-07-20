import React from 'react';

const QuoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 5.25L4.5 12l5.25 6.75M19.5 5.25L14.25 12l5.25 6.75" />
  </svg>
);

export default QuoteIcon;
