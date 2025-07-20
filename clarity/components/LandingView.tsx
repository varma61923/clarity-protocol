import React from 'react';
import ClarityLogo from './icons/ClarityLogo';
import { useI18n } from '../contexts/I18nContext';
import FAQ from './FAQ';
import { motion } from 'framer-motion';

interface LandingViewProps {
  onEnter: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onEnter }) => {
  const { t } = useI18n();
  const faqItems = [
    { question: t.faq.q1, answer: t.faq.a1 },
    { question: t.faq.q2, answer: t.faq.a2 },
    { question: t.faq.q3, answer: t.faq.a3 },
    { question: t.faq.q4, answer: t.faq.a4 },
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-light-surface-container-low dark:bg-dark-surface-container-low overflow-y-auto">
      <div className="flex flex-col items-center justify-center text-center p-4 min-h-screen w-full bg-gradient-to-br from-light-surface-dim to-light-surface-container-lowest dark:from-dark-surface-dim dark:to-dark-surface-container-lowest">
          <motion.div 
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
              <div className="flex items-center justify-center gap-4 mb-4">
              <ClarityLogo className="h-16 w-16 text-light-primary dark:text-dark-primary" />
              <h1 className="text-display-md md:text-display-lg font-bold text-light-on-surface dark:text-dark-on-surface tracking-tight">{t.landingTitle}</h1>
              </div>
              <p className="text-headline-sm font-normal text-light-on-surface-variant dark:text-dark-on-surface-variant max-w-3xl mx-auto mb-10">
              {t.landingSubtitle}
              </p>
              <button 
              onClick={onEnter} 
              className="bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-semibold py-4 px-10 rounded-full text-label-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-light-primary/20 dark:hover:shadow-dark-primary/20 mx-auto"
              >
              {t.enterFeed}
              </button>
          </motion.div>
      </div>
      <div className="w-full bg-light-surface-container dark:bg-dark-surface-container py-16 sm:py-24">
        <div className="w-full max-w-4xl mx-auto px-4">
            <h2 className="text-headline-md sm:text-headline-lg font-bold text-light-on-surface dark:text-dark-on-surface text-center mb-10">
                {t.learnMoreTitle}
            </h2>
            <FAQ items={faqItems} />
        </div>
      </div>
    </div>
  );
};

export default LandingView;