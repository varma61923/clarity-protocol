import React from 'react';
import { View, SiweSession } from '../types';
import DisconnectIcon from './icons/DisconnectIcon';
import DashboardIcon from './icons/DashboardIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import { useI18n } from '../contexts/I18nContext';

interface WalletConnectProps {
  session: SiweSession | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onNavigate: (view: View) => void;
  isMobile?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ session, onConnect, onDisconnect, onNavigate, isMobile=false }) => {
  const { t, direction } = useI18n();
  
  if (session) {
    const truncatedAddress = `${session.address.substring(0, 6)}...${session.address.substring(session.address.length - 4)}`;
    
    if (isMobile) {
        return (
            <div className="w-full flex flex-col gap-3">
                <button
                onClick={() => onNavigate('dashboard')}
                className="w-full h-12 bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold rounded-full transition-all flex items-center justify-center gap-2 text-label-lg"
                >
                  <DashboardIcon className="h-5 w-5" />
                  <span>{t.dashboardTitle}</span>
                </button>
                <div className="w-full flex items-center justify-between gap-2 bg-light-surface-container-high dark:bg-dark-surface-container-high p-2 rounded-full border border-light-outline dark:border-dark-outline">
                    <span className="font-mono text-label-lg text-light-on-surface dark:text-dark-on-surface px-2">{truncatedAddress}</span>
                    <button 
                        onClick={onDisconnect} 
                        className="p-2 rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-error-container/50 dark:hover:bg-dark-error-container/50 hover:text-light-on-error-container dark:hover:text-dark-on-error-container transition-colors"
                        aria-label={t.disconnectWallet}
                    >
                        <DisconnectIcon className={`h-5 w-5`}/>
                    </button>
                </div>
            </div>
        )
    }

    return (
      <div className="flex items-center gap-1">
         <button
          onClick={() => onNavigate('dashboard')}
          className="h-10 w-10 flex items-center justify-center rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors"
          title={t.dashboardTitle}
        >
          <DashboardIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onNavigate('subscription')}
          className="h-10 w-10 flex items-center justify-center rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors"
          title={t.subscriptions}
        >
          <UserGroupIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 bg-light-surface-container-high dark:bg-dark-surface-container-high p-1 pe-2 rounded-full border border-light-outline dark:border-dark-outline">
           <span className="font-mono text-label-lg text-light-on-surface dark:text-dark-on-surface ps-2">{truncatedAddress}</span>
           <button 
             onClick={onDisconnect} 
             className="h-8 w-8 flex items-center justify-center rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-error-container/50 dark:hover:bg-dark-error-container/50 hover:text-light-on-error-container dark:hover:text-dark-on-error-container transition-colors"
             aria-label={t.disconnectWallet}
            >
             <DisconnectIcon className={`h-5 w-5`}/>
           </button>
        </div>
      </div>
    );
  }

  const buttonClasses = "h-10 px-6 bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-label-lg font-semibold rounded-full transition-all hover:shadow-md";

  return (
    <button 
      onClick={onConnect} 
      className={`${buttonClasses} ${isMobile ? 'w-full h-12' : ''}`}
    >
      {t.connectWallet}
    </button>
  );
};

export default WalletConnect;