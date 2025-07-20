


import React, { useState } from 'react';
import { Article, Author } from '../types';
import VerifiedIcon from './icons/VerifiedIcon';
import ArticleCard from './ArticleCard';
import SubscribeIcon from './icons/SubscribeIcon';
import Spinner from './Spinner';
import { useI18n } from '../contexts/I18nContext';
import ReputationIcon from './icons/ReputationIcon';
import DonateToAuthorIcon from './icons/DonateToAuthorIcon';
import VoteIcon from './icons/VoteIcon';
import ReputationGraph from './ReputationGraph';

interface ProfileViewProps {
  author: Author;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
  onSubscribe: (authorId: string) => Promise<void>;
}

const StatCard: React.FC<{ value: string | number; label: string, icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center justify-center bg-light-surface-container-high dark:bg-dark-surface-container-high p-4 rounded-xl text-center">
        <div className="text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{icon}</div>
        <div className="text-title-lg font-bold text-light-on-surface dark:text-dark-on-surface">{value}</div>
        <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-wider mt-1">{label}</div>
    </div>
);


const ProfileView: React.FC<ProfileViewProps> = ({ author, articles, onSelectArticle, onBack, onSubscribe }) => {
  const { t } = useI18n();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribeClick = async () => {
    if (author.isSubscribed) return;
    setIsSubscribing(true);
    await onSubscribe(author.address);
    setIsSubscribing(false);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button onClick={onBack} className="mb-6 text-label-lg text-light-primary dark:text-dark-primary hover:underline">{t.backToFeed}</button>
      
      <header className="bg-light-surface-container dark:bg-dark-surface-container rounded-2xl p-6 sm:p-8 mb-8 border border-light-outline-variant dark:border-dark-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="p-3 bg-light-primary-container dark:bg-dark-primary-container rounded-full flex-shrink-0">
                    <VerifiedIcon className="h-10 w-10 text-light-on-primary-container dark:text-dark-on-primary-container" />
                </div>
                <div className="w-full">
                    <h1 className="text-headline-sm font-bold text-light-on-surface dark:text-dark-on-surface font-mono break-all">{author.address}</h1>
                    <p className="text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant mt-1">{t.verifiedJournalist}</p>
                    <button
                        onClick={handleSubscribeClick}
                        disabled={!!author.isSubscribed || isSubscribing}
                        className={`mt-4 h-10 px-6 rounded-full text-label-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                            author.isSubscribed 
                                ? 'bg-green-500/20 text-green-700 dark:text-green-300 dark:bg-green-500/10 cursor-default'
                                : 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:shadow-md'
                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {isSubscribing ? <Spinner /> : <SubscribeIcon className="h-5 w-5"/>}
                        <span>{author.isSubscribed ? t.subscribed : t.subscribe}</span>
                    </button>
                </div>
            </div>
             <div className="md:col-span-1 grid grid-cols-3 gap-4">
                <StatCard value={author.reputationScore} label={t.reputation} icon={<ReputationIcon className="h-6 w-6"/>} />
                <StatCard value={author.totalDonations || 0} label={t.donations} icon={<DonateToAuthorIcon className="h-6 w-6"/>} />
                <StatCard value={author.votesCasted || 0} label={t.daoVotes} icon={<VoteIcon className="h-6 w-6"/>} />
            </div>
        </div>
         {author.activity && author.activity.length > 0 && (
          <div className="mt-8">
            <h3 className="text-title-md font-semibold text-light-on-surface dark:text-dark-on-surface mb-3">{t.reputationHistory}</h3>
            <ReputationGraph activity={author.activity} initialScore={author.reputationScore} />
          </div>
        )}
      </header>

      <h2 className="text-headline-sm font-semibold text-light-on-surface dark:text-dark-on-surface mb-6">{t.publishedArticles.replace('{count}', `${articles.length}`)}</h2>

      {articles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onSelectArticle={onSelectArticle}
              onSelectAuthor={() => {}} 
              disableAuthorLink={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-light-surface-container dark:bg-dark-surface-container rounded-2xl">
          <p className="text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.noArticlesByAuthor}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileView;