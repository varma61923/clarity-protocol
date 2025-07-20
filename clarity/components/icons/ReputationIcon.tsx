
import React from 'react';

const ReputationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.06a.563.563 0 00-.182.557l1.528 4.971a.562.562 0 01-.82.622l-4.204-3.06a.563.563 0 00-.557 0l-4.204 3.06a.562.562 0 01-.82-.622l1.528-4.971a.563.563 0 00-.182-.557l-4.204-3.06a.562.562 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" />
  </svg>
);

export default ReputationIcon;
