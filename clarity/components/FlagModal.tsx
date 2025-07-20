import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import CloseIcon from './icons/CloseIcon';
import Spinner from './Spinner';

interface FlagModalProps {
  onClose: () => void;
  onConfirm: (reason: string, stake: number) => void;
  isFlagging: boolean;
}

const FlagModal: React.FC<FlagModalProps> = ({ onClose, onConfirm, isFlagging }) => {
  const { t } = useI18n();
  const [reason, setReason] = useState('');
  const [stake, setStake] = useState('500');

  const handleConfirm = () => {
    const stakeAmount = parseInt(stake, 10);
    if (!reason.trim() || isNaN(stakeAmount) || stakeAmount < 500) {
      return;
    }
    onConfirm(reason, stakeAmount);
  };

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
          <h2 className="text-title-lg font-semibold text-light-on-surface dark:text-dark-on-surface">{t.flagArticleTitle}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-highest dark:hover:bg-dark-surface-container-highest">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="flag-reason" className="block text-label-lg font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.flagReason}</label>
            <textarea
              id="flag-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={t.flagReasonPlaceholder}
              className="w-full bg-transparent border border-light-outline dark:border-dark-outline text-body-lg rounded-lg p-3 focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors text-light-on-surface dark:text-dark-on-surface"
            />
          </div>
          <div>
            <label htmlFor="flag-stake" className="block text-label-lg font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.flagStake}</label>
            <input
              type="number"
              id="flag-stake"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              min="500"
              className="w-full bg-transparent border border-light-outline dark:border-dark-outline text-body-lg rounded-lg p-3 focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors text-light-on-surface dark:text-dark-on-surface"
            />
            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-2">{t.flagStakeDescription}</p>
          </div>
        </div>
        <div className="p-6 bg-light-surface-container dark:bg-dark-surface-container border-t border-light-outline-variant dark:border-dark-outline-variant">
          <button
            onClick={handleConfirm}
            disabled={isFlagging || !reason.trim() || parseInt(stake, 10) < 500}
            className="w-full h-10 px-6 rounded-full bg-light-error dark:bg-dark-error text-light-on-error dark:text-dark-on-error font-semibold text-label-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {isFlagging ? <Spinner /> : t.confirmFlag}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlagModal;