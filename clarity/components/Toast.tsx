import React, { useEffect, useState } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);
  const { direction } = useI18n();

  useEffect(() => {
    setVisible(true); // Trigger fade-in
    const timer = setTimeout(() => {
      setVisible(false); // Trigger fade-out
      setTimeout(onClose, 300); // Wait for fade-out to complete
    }, 4700);

    return () => clearTimeout(timer);
  }, [message, type, onClose]);

  const baseClasses = "fixed top-5 inset-inline-end-5 z-[100] max-w-sm p-4 rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform";
  const typeClasses = type === 'success' 
    ? "bg-accent-green/90 text-white" 
    : "bg-accent-red/90 text-white";
  
  const visibilityClasses = visible 
    ? "opacity-100 translate-x-0" 
    : `opacity-0 ${direction === 'rtl' ? '-translate-x-10' : 'translate-x-10'}`;

  return (
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses}`} role="alert">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{message}</p>
        <button onClick={onClose} className="ms-4 -me-2 p-1 rounded-md hover:bg-white/20 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;