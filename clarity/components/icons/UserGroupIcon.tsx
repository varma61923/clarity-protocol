import React from 'react';

const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0115 9.75a3.75 3.75 0 01-2.25 3.512m-3.75-2.25A3.75 3.75 0 019 9.75a3.75 3.75 0 01-2.25 3.512M6.75 18a3 3 0 00-4.682-2.72a9.094 9.094 0 003.741.479m-.479-2.25a3.75 3.75 0 01-1.256-3.512A3.75 3.75 0 019 9.75a3.75 3.75 0 011.256 3.512" />
  </svg>
);

export default UserGroupIcon;
