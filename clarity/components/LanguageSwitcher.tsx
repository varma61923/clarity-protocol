import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { locales } from '../locales';
import GlobeIcon from './icons/GlobeIcon';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t, direction } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleSelect = (selectedLocale: string) => {
    setLocale(selectedLocale as keyof typeof locales);
    setIsOpen(false);
  }

  const menuPositionClass = direction === 'rtl' ? 'start-0' : 'end-0';

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 flex items-center justify-center rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors"
        aria-label={t.languageSwitcher}
        title={t.languageSwitcher}
      >
        <GlobeIcon className="h-6 w-6" />
      </button>

      <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${menuPositionClass} mt-2 w-48 bg-light-surface-container dark:bg-dark-surface-container rounded-lg shadow-2xl border border-light-outline-variant dark:border-dark-outline-variant overflow-hidden z-50`}
        >
          <ul className="py-1">
            {Object.entries(locales).map(([key, value]) => (
              <li key={key}>
                <button
                  onClick={() => handleSelect(key)}
                  className={`w-full text-start px-3 py-2 text-body-md transition-colors ${
                    locale === key
                      ? 'bg-light-primary-container text-light-on-primary-container dark:bg-dark-primary-container dark:text-dark-on-primary-container'
                      : 'text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high'
                  }`}
                >
                  {value.name}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;