import React from 'react';
import { Article, Author, SortOrder } from '../types';
import ArticleCard from './ArticleCard';
import { useI18n } from '../contexts/I18nContext';

interface ArticleFeedProps {
  articles: Article[];
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectAuthor: (author: Author) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  filterTag: string;
  onFilterTagChange: (tag: string) => void;
  searchQuery: string;
}

const SortButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ onClick, isActive, children, isFirst = false, isLast = false }) => (
  <button
    onClick={onClick}
    className={`px-4 h-10 text-label-lg font-semibold transition-colors duration-200 grow basis-0
      ${isFirst ? 'rounded-s-full' : ''}
      ${isLast ? 'rounded-e-full' : ''}
      ${isActive
        ? 'bg-light-secondary-container text-light-on-secondary-container dark:bg-dark-secondary-container dark:text-dark-on-secondary-container'
        : 'text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high'
    }`}
  >
    {children}
  </button>
);

const ArticleFeed: React.FC<ArticleFeedProps> = ({ articles, allArticles, onSelectArticle, onSelectAuthor, sortOrder, onSortChange, filterTag, onFilterTagChange, searchQuery }) => {
  const { t } = useI18n();

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    allArticles.forEach(article => {
      article.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allArticles]);

  return (
    <div>
      <div className="mb-6">
          <h1 className="text-headline-md font-semibold text-light-on-surface dark:text-dark-on-surface mb-1">{t.homeFeedTitle}</h1>
          <p className="text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.homeFeedSubtitle}</p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
              <label htmlFor="category-filter" className="block text-label-md font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">{t.filterByCategory}</label>
               <select 
                  id="category-filter"
                  value={filterTag}
                  onChange={(e) => onFilterTagChange(e.target.value)}
                  className="w-full h-10 px-4 text-body-lg bg-light-surface-container-high dark:bg-dark-surface-container-high rounded-full border border-light-outline dark:border-dark-outline focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent"
                  aria-label={t.filterByCategory}
              >
                  <option value="all">{t.allCategories}</option>
                  {allTags.map(tag => <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>)}
              </select>
          </div>
          <div className="md:justify-self-end">
             <div role="group" className="flex items-center border border-light-outline dark:border-dark-outline rounded-full w-full">
                <SortButton onClick={() => onSortChange('trending')} isActive={sortOrder === 'trending'} isFirst>{t.sortTrending}</SortButton>
                <div className="w-px h-5 bg-light-outline dark:border-dark-outline"></div>
                <SortButton onClick={() => onSortChange('latest')} isActive={sortOrder === 'latest'}>{t.sortLatest}</SortButton>
                 <div className="w-px h-5 bg-light-outline dark:border-dark-outline"></div>
                <SortButton onClick={() => onSortChange('trust')} isActive={sortOrder === 'trust'}>{t.sortTrust}</SortButton>
                 <div className="w-px h-5 bg-light-outline dark:border-dark-outline"></div>
                <SortButton onClick={() => onSortChange('reputation')} isActive={sortOrder === 'reputation'} isLast>{t.sortReputation}</SortButton>
            </div>
          </div>
      </div>
      
      {articles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onSelectAuthor={onSelectAuthor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-light-surface-container dark:bg-dark-surface-container rounded-2xl">
          <p className="text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            {searchQuery || filterTag !== 'all' ? t.noSearchResults.replace('{query}', searchQuery) : t.noArticlesFound}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticleFeed;