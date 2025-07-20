import React from 'react';

const HeadingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.5h-9m9 0V21m-9-16.5V21M3 4.5h3.75m11.25 0H21m-18 16.5h3.75m11.25 0H21" />
  </svg>
);

export default HeadingIcon;
