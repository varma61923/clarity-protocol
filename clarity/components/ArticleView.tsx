


import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, Author, SiweSession } from '../types';
import VerifiedIcon from './icons/VerifiedIcon';
import TrustIcon from './icons/TrustIcon';
import FlagIcon from './icons/FlagIcon';
import DonateToAuthorIcon from './icons/DonateToAuthorIcon';
import SubscribeIcon from './icons/SubscribeIcon';
import ShareIcon from './icons/ShareIcon';
import Spinner from './Spinner';
import FlagModal from './FlagModal';
import { useI18n } from '../contexts/I18nContext';
import { calculateImpactScore } from '../utils/scoring';
import ShieldIcon from './icons/ShieldIcon';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onSelectAuthor: (author: Author) => void;
  session: SiweSession | null;
  onVerifyArticle: (articleId: number) => Promise<void>;
  onFlagArticle: (articleId: number, reason: string, stake: number) => Promise<void>;
  onOpenDonateModal: () => void;
  onSubscribe: (authorAddress: string) => Promise<void>;
  onShare: (article: Article) => Promise<void>;
}

const ActionButton: React.FC<{onClick?: () => void, disabled: boolean, isLoading?: boolean, children: React.ReactNode, className?: string, title: string, variant?: 'filled' | 'tonal' | 'outlined'}> = ({ onClick, disabled, isLoading, children, className="", title, variant='tonal' }) => {
  const baseClasses = `h-10 px-4 sm:px-6 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 text-label-lg disabled:opacity-50 disabled:cursor-not-allowed`;
  
  let variantClasses = '';
  switch(variant) {
    case 'filled':
      variantClasses = 'bg-light-primary text-light-on-primary dark:bg-dark-primary dark:text-dark-on-primary hover:shadow-lg';
      break;
    case 'outlined':
       variantClasses = 'border border-light-outline dark:border-dark-outline text-light-primary dark:text-dark-primary hover:bg-light-primary/5 dark:hover:bg-dark-primary/5';
       break;
    case 'tonal':
    default:
       variantClasses = 'bg-light-secondary-container text-light-on-secondary-container dark:bg-dark-secondary-container dark:text-dark-on-secondary-container hover:shadow-md';
       break;
  }
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${className}`}
      title={title}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}


const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, onSelectAuthor, session, onVerifyArticle, onFlagArticle, onOpenDonateModal, onSubscribe, onShare }) => {
  const { t, locale } = useI18n();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  const formattedDate = new Date(article.timestamp).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isAuthenticated = !!session;
  const impactScore = calculateImpactScore(article);

  const contentWithGlossary = useMemo(() => {
    let finalHtml = article.content;
    const glossary = t.glossary;
    const glossaryTerms = Object.keys(glossary).sort((a, b) => b.length - a.length);
    for (const term of glossaryTerms) {
      const regex = new RegExp(`\\b(${term})\\b(?![^<]*?>)`, 'gi');
      const definition = glossary[term as keyof typeof glossary].replace(/"/g, '&quot;');
      finalHtml = finalHtml.replace(regex, `<span class="glossary-term" title="${definition}">$1</span>`);
    }
    return finalHtml;
  }, [article.content, t.glossary]);


  const handleVerifyClick = async () => {
    if (article.isFlagged) return;
    setIsVerifying(true);
    await onVerifyArticle(article.id);
    setIsVerifying(false);
  };
  
  const handleFlagConfirm = async (reason: string, stake: number) => {
    if (article.isFlagged) return;
    setIsFlagging(true);
    await onFlagArticle(article.id, reason, stake);
    setIsFlagging(false);
    setIsFlagModalOpen(false);
  };

  const handleSubscribeClick = async () => {
      if (article.author.isSubscribed) return;
      setIsSubscribing(true);
      await onSubscribe(article.author.address);
      setIsSubscribing(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-label-lg text-light-primary dark:text-dark-primary hover:underline">{t.backToFeed}</button>
      
      <AnimatePresence>
        {isFlagModalOpen && (
            <FlagModal
                onClose={() => setIsFlagModalOpen(false)}
                onConfirm={handleFlagConfirm}
                isFlagging={isFlagging}
            />
        )}
      </AnimatePresence>

      <article className="bg-light-surface-container dark:bg-dark-surface-container rounded-2xl p-6 sm:p-8 border border-light-outline-variant dark:border-dark-outline-variant">
        <header className="border-b border-light-outline-variant dark:border-dark-outline-variant pb-6 mb-6">
          <h1 className="text-headline-lg font-bold text-light-on-surface dark:text-dark-on-surface mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4 text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            <div className="flex items-center gap-3">
              <VerifiedIcon className="h-6 w-6 text-light-primary dark:text-dark-primary" />
              <div>
                <button onClick={() => onSelectAuthor(article.author)} className="font-mono hover:text-light-primary hover:dark:text-dark-primary hover:underline" aria-label={t.viewAuthorProfile.replace('{authorId}', article.author.address)}>{article.author.address}</button>
                <span className="mx-2 text-light-outline dark:text-dark-outline">&#8226;</span>
                <span className="font-semibold">{t.reputation}: {article.author.reputationScore}</span>
              </div>
            </div>
            <span>{t.publishedOn.replace('{date}', formattedDate)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-2 gap-y-2 items-center">
             {article.tags.map(tag => (
              <div key={tag} className="flex items-center text-label-md font-medium px-2.5 py-1 rounded-md bg-light-secondary-container text-light-on-secondary-container dark:bg-dark-secondary-container dark:text-dark-on-secondary-container">
                {tag}
              </div>
            ))}
            {article.isWatermarked && (
                <div className="flex items-center gap-1.5 text-label-md text-light-tertiary dark:text-dark-tertiary" title={t.tooltip.zkWatermarked}>
                    <ShieldIcon className="h-4 w-4" />
                    <span className="font-semibold">{t.zkWatermarked}</span>
                </div>
            )}
          </div>
        </header>

        {article.isFlagged && (
            <div className="bg-light-error-container text-light-on-error-container dark:bg-dark-error-container dark:text-dark-on-error-container p-4 rounded-xl mb-6 flex items-center gap-3">
                <FlagIcon className="h-6 w-6 flex-shrink-0" />
                <p className="text-body-md font-semibold">{t.flaggedBanner}</p>
            </div>
        )}

        <div 
            className="prose prose-lg dark:prose-invert max-w-none text-light-on-surface dark:text-dark-on-surface prose-headings:text-light-on-surface dark:prose-headings:text-dark-on-surface prose-a:text-light-primary dark:prose-a:text-dark-primary hover:prose-a:underline prose-strong:text-light-on-surface dark:prose-strong:text-dark-on-surface prose-blockquote:border-s-light-primary dark:prose-blockquote:border-s-dark-primary"
            dangerouslySetInnerHTML={{ __html: contentWithGlossary }} 
        />

        <footer className="mt-8 border-t border-light-outline-variant dark:border-dark-outline-variant pt-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <span className="text-title-lg font-semibold text-light-tertiary dark:text-dark-tertiary">{impactScore}</span>
                <span className="text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.impactScore}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-start gap-3">
                <ActionButton
                    onClick={handleVerifyClick}
                    disabled={!isAuthenticated || !!article.isFlagged}
                    isLoading={isVerifying}
                    variant='filled'
                    className="md:order-1"
                    title={!isAuthenticated ? t.tooltip.connectToVerify : (article.isFlagged ? t.tooltip.cannotVerifyFlagged : t.tooltip.verify)}
                >
                    <TrustIcon className="h-5 w-5" />
                    <span>{t.verifyTrust}</span>
                </ActionButton>
                <ActionButton
                    onClick={() => setIsFlagModalOpen(true)}
                    disabled={!isAuthenticated || !!article.isFlagged}
                    isLoading={isFlagging}
                    variant='outlined'
                    className="md:order-2 border-light-error/70 text-light-error dark:border-dark-error/70 dark:text-dark-error hover:bg-light-error/5 dark:hover:bg-dark-error/5"
                    title={!isAuthenticated ? t.tooltip.connectToFlag : (article.isFlagged ? t.tooltip.alreadyFlagged : t.tooltip.flag)}
                >
                    <FlagIcon className="h-5 w-5" />
                    <span>{article.isFlagged ? t.flagged : t.stakeToFlag}</span>
                </ActionButton>
                <div className="hidden md:block h-6 w-px bg-light-outline-variant dark:bg-dark-outline-variant md:order-3 mx-2"></div>
                 <ActionButton
                    onClick={onOpenDonateModal}
                    disabled={!isAuthenticated}
                    variant='tonal'
                    className="md:order-4"
                    title={!isAuthenticated ? t.tooltip.connectToDonate : t.tooltip.donate}
                >
                    <DonateToAuthorIcon className="h-5 w-5" />
                    <span>{t.donate}</span>
                </ActionButton>
                <ActionButton
                    onClick={handleSubscribeClick}
                    disabled={!isAuthenticated || !!article.author.isSubscribed}
                    isLoading={isSubscribing}
                    variant='tonal'
                    className={`md:order-5 ${article.author.isSubscribed ? 'bg-accent-green/20 text-accent-green' : ''}`}
                    title={!isAuthenticated ? t.tooltip.connectToSubscribe : (article.author.isSubscribed ? t.tooltip.alreadySubscribed : t.tooltip.subscribe)}
                >
                    <SubscribeIcon className="h-5 w-5" />
                    <span>{article.author.isSubscribed ? t.subscribed : t.subscribe}</span>
                </ActionButton>
                <ActionButton
                    onClick={() => onShare(article)}
                    disabled={false}
                    variant='tonal'
                    className="md:order-6"
                    title={t.tooltip.share}
                >
                    <ShareIcon className="h-5 w-5" />
                    <span>{t.share}</span>
                </ActionButton>
            </div>
        </footer>
      </article>

      <div className="mt-8 p-4 bg-light-surface-container dark:bg-dark-surface-container rounded-2xl border border-light-outline-variant dark:border-dark-outline-variant">
        <h3 className="text-title-md font-semibold text-light-on-surface dark:text-dark-on-surface mb-3">{t.articleMetadata}</h3>
        <div className="font-mono text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <strong className="text-light-on-surface dark:text-dark-on-surface flex-shrink-0">Content CID:</strong>
                <a href={`https://ipfs.io/ipfs/${article.contentCid}`} target="_blank" rel="noopener noreferrer" className="text-light-primary dark:text-dark-primary hover:underline break-all">
                    {article.contentCid}
                </a>
            </div>
             <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <strong className="text-light-on-surface dark:text-dark-on-surface flex-shrink-0">Metadata CID:</strong>
                <a href={`https://ipfs.io/ipfs/${article.metadataCid}`} target="_blank" rel="noopener noreferrer" className="text-light-primary dark:text-dark-primary hover:underline break-all">
                    {article.metadataCid}
                </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <strong className="text-light-on-surface dark:text-dark-on-surface flex-shrink-0">Signature:</strong>
                <span className="break-all">{article.signature}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;