import React, { useState } from 'react';
import HeartIcon from './icons/HeartIcon';
import Spinner from './Spinner';
import { useI18n } from '../contexts/I18nContext';

interface FooterProps {
  walletAddress: string | null;
  onDonate: () => Promise<void>;
}

const Footer: React.FC<FooterProps> = ({ walletAddress, onDonate }) => {
  const { t } = useI18n();
  const [isDonating, setIsDonating] = useState(false);

  const handleDonateClick = async () => {
    setIsDonating(true);
    await onDonate();
    setIsDonating(false);
  }

  return (
    <footer className="bg-light-surface-container dark:bg-dark-surface-container border-t border-light-surface-container-high dark:border-dark-surface-container-high">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-light-on-surface-variant dark:text-dark-on-surface-variant">
        <button
          onClick={handleDonateClick}
          disabled={!walletAddress || isDonating}
          className="mb-6 h-10 px-6 font-semibold rounded-full border border-light-outline dark:border-dark-outline text-light-primary dark:text-dark-primary transition-colors hover:bg-light-primary/5 dark:hover:bg-dark-primary/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          title={!walletAddress ? t.connectWallet : t.protocolDonationTooltip}
        >
          {isDonating ? (
            <>
              <Spinner />
              <span className="text-label-lg">{t.protocolDonationProcessing}</span>
            </>
          ) : (
            <>
              <HeartIcon className="h-5 w-5" />
              <span className="text-label-lg">{t.donateToProtocol}</span>
            </>
          )}
        </button>
        <p className="text-label-md">{t.protocolRights.replace('{year}', `${new Date().getFullYear()}`)}</p>
        <p className="text-label-sm mt-2 opacity-75">{t.protocolMission}</p>
      </div>
    </footer>
  );
};

export default Footer;