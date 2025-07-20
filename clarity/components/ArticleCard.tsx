import React from 'react';
import { Article, Author } from '../types';
import VerifiedIcon from './icons/VerifiedIcon';
import FlagIcon from './icons/FlagIcon';
import { useI18n } from '../contexts/I18nContext';
import { calculateImpactScore } from '../utils/scoring';
import ImpactScoreIcon from './icons/ImpactScoreIcon';
import ReputationIcon from './icons/ReputationIcon';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onSelectAuthor: (author: Author) => void;
  disableAuthorLink?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelectArticle, onSelectAuthor, disableAuthorLink = false }) => {
  const { t, locale } = useI18n();

  const formattedDate = new Date(article.timestamp).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectAuthor(article.author);
  };

  const AuthorInfo = (
    <div className="flex items-center gap-2">
      <VerifiedIcon className="h-4 w-4 text-light-primary dark:text-dark-primary" />
      <span className={`font-mono text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant ${!disableAuthorLink && 'group-hover:text-light-primary group-hover:dark:text-dark-primary'}`}>{article.author.address.substring(0,6)}...{article.author.address.slice(-4)}</span>
    </div>
  );

  const impactScore = calculateImpactScore(article);

  return (
    <div 
      className="bg-light-surface-container-low dark:bg-dark-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-light-outline-variant dark:border-dark-outline-variant hover:border-light-primary/30 dark:hover:border-dark-primary/30 flex flex-col"
      onClick={() => onSelectArticle(article)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelectArticle(article)}
      aria-label={t.readArticle.replace('{title}', article.title)}
    >
      <div className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-3">
          {disableAuthorLink ? (
             AuthorInfo
          ) : (
            <button onClick={handleAuthorClick} className="group" aria-label={t.viewAuthorProfile.replace('{authorId}', article.author.address)}>
              {AuthorInfo}
            </button>
          )}
          <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{formattedDate}</div>
        </div>
        <h3 className="text-title-lg font-semibold text-light-on-surface dark:text-dark-on-surface mb-2 leading-tight">{article.title}</h3>
        <p className="text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-4 leading-relaxed line-clamp-3">{article.content.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map(tag => (
            <div key={tag} className="flex items-center text-label-md font-medium px-2 py-1 rounded-md bg-light-secondary-container text-light-on-secondary-container dark:bg-dark-secondary-container dark:text-dark-on-secondary-container">
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-3 border-t border-light-surface-container-high dark:border-dark-surface-container-high flex flex-wrap justify-between items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1.5 text-label-md" title={t.impactScore}>
            <ImpactScoreIcon className="w-4 h-4 text-light-tertiary dark:text-dark-tertiary" />
            <span className="font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">{impactScore}</span>
        </div>
        <div className="flex items-center gap-1.5 text-label-md" title={t.authorReputation}>
            <ReputationIcon className="w-4 h-4 text-light-tertiary dark:text-dark-tertiary" />
            <span className="font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">{article.author.reputationScore}</span>
        </div>
        {article.isFlagged && (
          <div className="flex items-center gap-1.5 text-label-md font-semibold text-light-error dark:text-dark-error" title={t.tooltip.alreadyFlagged}>
              <FlagIcon className="h-4 w-4" />
              <span>{t.flagged}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;