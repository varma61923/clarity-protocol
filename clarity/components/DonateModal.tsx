import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Author } from '../types';
import Spinner from './Spinner';
import CloseIcon from './icons/CloseIcon';
import VerifiedIcon from './icons/VerifiedIcon';
import { useI18n } from '../contexts/I18nContext';
import ShieldIcon from './icons/ShieldIcon';

interface DonateModalProps {
  author: Author;
  onClose: () => void;
  onConfirmDonate: (authorId: string, amount: number, supportProtocol: boolean, isAnonymous: boolean) => Promise<void>;
}

const DonateModal: React.FC<DonateModalProps> = ({ author, onClose, onConfirmDonate }) => {
  const { t } = useI18n();
  const [amount, setAmount] = useState('10');
  const [token, setToken] = useState('USDC');
  const [supportProtocol, setSupportProtocol] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [zkStep, setZkStep] = useState(0); // 0: idle, 1: proving, 2: relaying, 3: success

  const handleConfirm = async (isAnonymous: boolean) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    setIsDonating(true);
    
    if (isAnonymous) {
        setZkStep(1); // Start proving
        await new Promise(res => setTimeout(res, 2000));
        setZkStep(2); // Start relaying
        await new Promise(res => setTimeout(res, 1500));
    }

    await onConfirmDonate(author.address, numericAmount, supportProtocol, isAnonymous);
    
    if (isAnonymous) {
        setZkStep(3); // Success
        await new Promise(res => setTimeout(res, 2000));
    }
    
    // Close modal after non-anonymous donation or after success message
    onClose();
    setIsDonating(false);
  };

  const TokenButton: React.FC<{ value: string }> = ({ value }) => (
    <button 
      onClick={() => setToken(value)} 
      className={`px-3 py-1.5 rounded-lg text-label-lg font-semibold border transition-colors ${
        token === value 
          ? 'bg-light-secondary-container text-light-on-secondary-container border-light-secondary-container dark:bg-dark-secondary-container dark:text-dark-on-secondary-container dark:border-dark-secondary-container' 
          : 'border-light-outline dark:border-dark-outline bg-transparent text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high'
      }`}
    >
      {value}
    </button>
  );

  const renderContent = () => {
    if (zkStep > 0) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Spinner />
                <h3 className="text-title-lg font-semibold text-light-on-surface dark:text-dark-on-surface">
                    {zkStep === 1 && t.anonymousDonationSteps.proving}
                    {zkStep === 2 && t.anonymousDonationSteps.relaying}
                    {zkStep === 3 && t.anonymousDonationSteps.success}
                </h3>
                <p className="text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    {t.anonymousDonationSteps.description}
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <VerifiedIcon className="h-8 w-8 text-light-primary dark:text-dark-primary" />
                <div>
                  <p className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.donatingTo}</p>
                  <p className="font-mono text-body-md text-light-on-surface dark:text-dark-on-surface">{author.address}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-label-lg font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.token}</label>
                <div className="flex gap-2">
                  <TokenButton value="ETH" />
                  <TokenButton value="USDC" />
                  <TokenButton value="MATIC" />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="amount" className="block text-label-lg font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.amount}</label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-12 px-4 bg-transparent border border-light-outline dark:border-dark-outline text-title-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors text-light-on-surface dark:text-dark-on-surface"
                  />
                  <span className="absolute inset-y-0 end-4 flex items-center text-light-on-surface-variant dark:text-dark-on-surface-variant font-semibold">{token}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-light-surface-container dark:bg-dark-surface-container p-3 rounded-lg">
                 <input 
                    id="support" 
                    type="checkbox" 
                    checked={supportProtocol}
                    onChange={(e) => setSupportProtocol(e.target.checked)}
                    className="h-4 w-4 rounded border-light-outline-variant dark:border-dark-outline-variant text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary"
                  />
                <label htmlFor="support" className="text-label-lg font-medium text-light-on-surface dark:text-dark-on-surface">
                  {t.supportProtocol}
                </label>
              </div>
            </div>
            <div className="p-6 bg-light-surface-container dark:bg-dark-surface-container border-t border-light-outline-variant dark:border-dark-outline-variant rounded-b-2xl space-y-3">
              <button 
                onClick={() => handleConfirm(false)}
                disabled={isDonating || !amount || parseFloat(amount) <= 0}
                className="w-full h-10 px-6 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-label-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {isDonating && zkStep === 0 ? <Spinner/> : t.confirmDonation}
              </button>
              <button 
                onClick={() => handleConfirm(true)}
                disabled={isDonating || !amount || parseFloat(amount) <= 0}
                className="w-full h-10 px-6 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container text-label-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              >
                <ShieldIcon className="h-5 w-5"/>
                {isDonating && zkStep > 0 ? <Spinner/> : t.anonymousDonation}
              </button>
            </div>
        </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-dark-scrim/60 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-light-surface-container-high dark:bg-dark-surface-container-high rounded-2xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-light-outline-variant dark:border-dark-outline-variant flex justify-between items-center">
          <h2 className="text-title-lg font-semibold text-light-on-surface dark:text-dark-on-surface">{t.supportAuthor}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-highest dark:hover:bg-dark-surface-container-highest">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};

export default DonateModal;