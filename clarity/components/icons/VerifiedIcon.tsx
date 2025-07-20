
import React from 'react';

const VerifiedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.414 7.586a1 1 0 00-1.414-1.414L10 12.172l-1.99-1.99a1 1 0 10-1.414 1.414l2.7 2.7a1 1 0 001.414 0l4.208-4.208z"
    />
  </svg>
);

export default VerifiedIcon;
