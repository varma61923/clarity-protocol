import React, { useState } from 'react';
import { Author } from '../types';
import { useI18n } from '../contexts/I18nContext';
import VerifiedIcon from './icons/VerifiedIcon';
import UserMinusIcon from './icons/UserMinusIcon';
import Spinner from './Spinner';

interface SubscribedAuthorCardProps {
  author: Author;
  onUnsubscribe: (authorId: string) => Promise<void>;
  onSelectAuthor: (author: Author) => void;
}

const SubscribedAuthorCard: React.FC<SubscribedAuthorCardProps> = ({ author, onUnsubscribe, onSelectAuthor }) => {
    const { t } = useI18n();
    const [isUnsubscribing, setIsUnsubscribing] = useState(false);

    const handleUnsubscribeClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUnsubscribing(true);
        await onUnsubscribe(author.address);
        // No need to set back to false as the component will re-render without this author
    };

    return (
        <div className="bg-light-surface-container-high dark:bg-dark-surface-container-high rounded-xl p-4 border border-light-outline-variant dark:border-dark-outline-variant">
            <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <VerifiedIcon className="h-8 w-8 text-light-primary dark:text-dark-primary flex-shrink-0" />
                    <div className="overflow-hidden">
                        <p className="font-mono text-body-md text-light-on-surface dark:text-dark-on-surface truncate">{author.address}</p>
                        <p className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.reputation}: {author.reputationScore}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onSelectAuthor(author)}
                      className="h-9 px-4 rounded-full border border-light-outline dark:border-dark-outline text-label-lg font-semibold text-light-primary dark:text-dark-primary hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
                    >
                      {t.viewProfile}
                    </button>
                    <button
                        onClick={handleUnsubscribeClick}
                        disabled={isUnsubscribing}
                        className="h-9 px-4 rounded-full text-label-lg font-semibold flex items-center justify-center gap-2 transition-colors bg-light-error-container text-light-on-error-container dark:bg-dark-error-container dark:text-dark-on-error-container hover:shadow-md disabled:opacity-50"
                        title={t.unsubscribe}
                    >
                        {isUnsubscribing ? <Spinner /> : <UserMinusIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SubscriptionCenterViewProps {
  subscribedAuthors: Author[];
  onUnsubscribe: (authorId: string) => Promise<void>;
  onSelectAuthor: (author: Author) => void;
}

const SubscriptionCenterView: React.FC<SubscriptionCenterViewProps> = ({ subscribedAuthors, onUnsubscribe, onSelectAuthor }) => {
  const { t } = useI18n();
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-headline-lg font-bold text-light-on-surface dark:text-dark-on-surface mb-2">{t.subscriptionCenterTitle}</h1>
      <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant mb-8">
        {t.subscriptionCenterDesc}
      </p>
      
      {subscribedAuthors.length > 0 ? (
        <div className="space-y-4">
          {subscribedAuthors.map(author => (
            <SubscribedAuthorCard 
              key={author.address} 
              author={author} 
              onUnsubscribe={onUnsubscribe}
              onSelectAuthor={onSelectAuthor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-light-surface-container dark:bg-dark-surface-container rounded-2xl border border-dashed border-light-outline-variant dark:border-dark-outline-variant">
          <p className="text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.noSubscriptions}</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCenterView;