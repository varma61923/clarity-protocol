

import React, { useState } from 'react';
import { Author, View, Draft, Article } from '../types';
import { useI18n } from '../contexts/I18nContext';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import ShieldIcon from './icons/ShieldIcon';
import Spinner from './Spinner';
import ReputationGraph from './ReputationGraph';

interface DashboardStats {
  author: Author;
  totalArticles: number;
  totalVerifications: number;
}

interface DashboardViewProps {
  stats: DashboardStats;
  drafts: Draft[];
  articles: Article[];
  onNavigate: (view: View, entityId?: string | null) => void;
  onDeleteDraft: (draftId: string) => void;
  onVerifyZkKyc: (authorId: string) => void;
  onDelegateVote: (delegateeAddress: string) => void;
  onMintSbt: () => void;
  walletAddress: string;
}

type DashboardTab = 'stats' | 'drafts' | 'history' | 'identity' | 'delegation';

const StatCard: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="bg-light-surface-container-high dark:bg-dark-surface-container-high p-6 rounded-xl text-center border border-light-outline-variant dark:border-dark-outline-variant">
        <div className="text-3xl lg:text-4xl font-bold text-light-primary dark:text-dark-primary">{value}</div>
        <div className="text-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-wider mt-1">{label}</div>
    </div>
);

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold text-label-lg rounded-full transition-colors ${
        isActive 
          ? 'bg-light-primary-container text-light-on-primary-container' 
          : 'text-light-on-surface-variant hover:bg-light-surface-container-high'
      }`}
    >
      {children}
    </button>
  );

const DashboardView: React.FC<DashboardViewProps> = ({ stats, drafts, articles, onNavigate, onDeleteDraft, onVerifyZkKyc, onDelegateVote, onMintSbt, walletAddress }) => {
  const { t, locale } = useI18n();
  const { author, totalArticles, totalVerifications } = stats;
  const [activeTab, setActiveTab] = useState<DashboardTab>('stats');
  const [zkKycStep, setZkKycStep] = useState(0);
  const [delegatee, setDelegatee] = useState('');
  const [isMintingSbt, setIsMintingSbt] = useState(false);

  const handleDeleteClick = (draft: Draft) => {
      if (window.confirm(t.confirmDeleteDraft.replace('{title}', draft.title || t.untitledDraft))) {
          onDeleteDraft(draft.id);
      }
  }
  
  const handleZkKyc = async (step: number) => {
    setZkKycStep(step + 1);
    await new Promise(res => setTimeout(res, 1500));
    if (step === 2) {
      onVerifyZkKyc(walletAddress);
      setZkKycStep(4);
    }
  }

  const handleDelegationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onDelegateVote(delegatee);
      setDelegatee('');
  }

  const handleMintSbt = async () => {
    setIsMintingSbt(true);
    await onMintSbt();
    setIsMintingSbt(false);
  }

  const renderContent = () => {
      switch(activeTab) {
        case 'stats':
            return (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard value={totalArticles} label={t.totalArticles} />
                    <StatCard value={totalVerifications} label={t.totalVerifications} />
                    <StatCard value={author.totalDonations || 0} label={t.totalDonations} />
                    <StatCard value={author.reputationScore} label={t.reputation} />
                </div>
                 {author.activity && author.activity.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-title-lg font-semibold text-light-on-surface dark:text-dark-on-surface mb-4">{t.reputationHistory}</h3>
                    <div className="p-6 bg-light-surface-container-high dark:bg-dark-surface-container-high rounded-xl">
                      <ReputationGraph activity={author.activity} initialScore={author.reputationScore} />
                    </div>
                  </div>
                )}
              </div>
            );
        case 'drafts':
            return (
                <div>
                     <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                        <h3 className="text-xl font-bold text-light-on-surface dark:text-dark-on-surface mb-3 sm:mb-0">{t.yourDrafts}</h3>
                        <button
                          onClick={() => onNavigate('publish', null)}
                          className="h-10 px-5 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-label-lg font-semibold flex items-center justify-center gap-2 self-start sm:self-center hover:shadow-lg"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span>{t.startNewArticle}</span>
                        </button>
                    </div>
                     {drafts.length > 0 ? (
                        <div className="space-y-3">
                            {drafts.map(draft => (
                                <div key={draft.id} className="bg-light-surface-container-high dark:bg-dark-surface-container-high p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-light-on-surface dark:text-dark-on-surface">{draft.title || t.untitledDraft}</h3>
                                        <p className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.lastSaved.replace('{date}', new Date(draft.lastSaved).toLocaleString(locale))}</p>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                                        <button onClick={() => onNavigate('publish', draft.id)} className="flex items-center gap-2 text-label-lg text-light-primary dark:text-dark-primary hover:underline font-semibold" title={t.editDraft}>
                                            <PencilIcon className="h-5 w-5"/>
                                            <span className="hidden sm:inline">{t.editDraft}</span>
                                        </button>
                                        <button onClick={() => handleDeleteClick(draft)} className="flex items-center gap-2 text-label-lg text-light-error dark:text-dark-error hover:underline font-semibold" title={t.deleteDraft}>
                                            <TrashIcon className="h-5 w-5"/>
                                            <span className="hidden sm:inline">{t.deleteDraft}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-light-on-surface-variant dark:text-dark-on-surface-variant py-8">{t.noDraftsFound}</p>
                    )}
                </div>
            );
        case 'history':
            return (
                 <div>
                    <h3 className="text-xl font-bold text-light-on-surface dark:text-dark-on-surface mb-6">{t.publishHistory}</h3>
                    {articles.length > 0 ? (
                        <div className="space-y-3">
                            {articles.map(article => (
                                <div key={article.id} className="bg-light-surface-container-high dark:bg-dark-surface-container-high p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-light-on-surface dark:text-dark-on-surface">{article.title}</h3>
                                        <p className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.publishedOn.replace('{date}', new Date(article.timestamp).toLocaleDateString(locale))}</p>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                                        <button onClick={() => onNavigate('article', article.id.toString())} className="text-label-lg text-light-primary dark:text-dark-primary hover:underline font-semibold">
                                            <span>{t.viewArticle}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-light-on-surface-variant dark:text-dark-on-surface-variant py-8">{t.noPublishedArticles}</p>
                    )}
                </div>
            )
        case 'identity':
            return (
                <div>
                     <h3 className="text-xl font-bold text-light-on-surface dark:text-dark-on-surface mb-2">{t.zkKyc.title}</h3>
                     <p className="text-light-on-surface-variant dark:text-dark-on-surface-variant mb-6">{t.zkKyc.description}</p>
                     <div className="p-6 bg-light-surface-container-high dark:bg-dark-surface-container-high rounded-lg">
                        {author.sbtTokenId ? (
                            <p className="font-semibold text-accent-green flex items-center gap-2"><ShieldIcon className="h-6 w-6" /> You are a verified journalist (SBT #{author.sbtTokenId})</p>
                        ) : (
                            <button onClick={handleMintSbt} disabled={isMintingSbt} className="h-10 px-5 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold flex items-center gap-2 disabled:opacity-50">
                                {isMintingSbt ? <Spinner /> : <ShieldIcon className="h-5 w-5"/>}
                                {isMintingSbt ? 'Minting SBT...' : 'Become a Journalist'}
                            </button>
                        )}
                     </div>

                     <h3 className="text-xl font-bold text-light-on-surface dark:text-dark-on-surface mb-2 mt-8">{t.zkKyc.title}</h3>
                     <p className="text-light-on-surface-variant dark:text-dark-on-surface-variant mb-6">{t.zkKyc.description}</p>
                     <div className="p-6 bg-light-surface-container-high dark:bg-dark-surface-container-high rounded-lg">
                        {author.isZkVerified ? (
                            <p className="font-semibold text-accent-green flex items-center gap-2"><ShieldIcon className="h-6 w-6" /> {t.zkKyc.alreadyVerified}</p>
                        ) : zkKycStep === 0 ? (
                            <button onClick={() => handleZkKyc(0)} className="h-10 px-5 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold flex items-center gap-2">
                                <ShieldIcon className="h-5 w-5"/>
                                {t.zkKyc.buttonStart}
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <p className={`flex items-center gap-2 ${zkKycStep > 0 ? 'text-accent-green' : ''}`}>
                                    {zkKycStep > 1 ? <ShieldIcon className="h-5 w-5"/> : <Spinner />}
                                    {t.zkKyc.step1}
                                </p>
                                {zkKycStep > 1 && (
                                     <p className={`flex items-center gap-2 ${zkKycStep > 1 ? 'text-accent-green' : ''}`}>
                                        {zkKycStep > 2 ? <ShieldIcon className="h-5 w-5"/> : <Spinner />}
                                        {t.zkKyc.step2}
                                        {zkKycStep === 2 && (
                                            <button onClick={() => handleZkKyc(2)} className="ms-4 h-8 px-4 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold text-sm">{t.zkKyc.buttonSubmitProof}</button>
                                        )}
                                    </p>
                                )}
                                 {zkKycStep > 2 && (
                                     <p className={`flex items-center gap-2 ${zkKycStep > 2 ? 'text-accent-green' : ''}`}>
                                        {zkKycStep > 3 ? <ShieldIcon className="h-5 w-5"/> : <Spinner />}
                                        {t.zkKyc.step3}
                                    </p>
                                )}
                                {zkKycStep > 3 && (
                                    <p className="font-semibold text-accent-green flex items-center gap-2"><ShieldIcon className="h-6 w-6" /> {t.zkKyc.success}</p>
                                )}
                            </div>
                        )}
                     </div>
                </div>
            )
        case 'delegation':
             return (
                 <div>
                     <h3 className="text-xl font-bold text-light-on-surface dark:text-dark-on-surface mb-2">{t.delegateVote}</h3>
                     <p className="text-light-on-surface-variant dark:text-dark-on-surface-variant mb-6 max-w-2xl">{t.delegationDesc}</p>
                     
                     {author.delegatedTo && (
                         <div className="mb-6 p-4 bg-light-surface-container-high dark:bg-dark-surface-container-high rounded-lg">
                            <p className="text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.currentDelegate}</p>
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-light-on-surface dark:text-dark-on-surface">{author.delegatedTo}</p>
                                <button onClick={() => onDelegateVote('')} className="h-9 px-4 rounded-full border border-light-outline dark:border-dark-outline text-label-lg font-semibold text-light-primary dark:text-dark-primary hover:bg-light-primary/5 dark:hover:bg-dark-primary/5">
                                    {t.removeDelegation}
                                </button>
                            </div>
                         </div>
                     )}

                     <form onSubmit={handleDelegationSubmit} className="max-w-2xl">
                        <label htmlFor="delegatee" className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.delegateVote}</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="text" 
                                id="delegatee"
                                value={delegatee}
                                onChange={(e) => setDelegatee(e.target.value)}
                                placeholder={t.delegationPlaceholder}
                                className="flex-grow w-full h-12 px-4 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-light-outline dark:border-dark-outline text-body-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors font-mono"
                            />
                            <button type="submit" className="h-12 px-6 rounded-lg bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-label-lg font-semibold disabled:opacity-50" disabled={!delegatee}>
                                {t.delegateVote}
                            </button>
                        </div>
                     </form>
                 </div>
             )
      }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-headline-md font-bold text-light-on-surface dark:text-dark-on-surface">{t.dashboardTitle}</h1>
        <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.dashboardWelcome}</p>
        <p className="text-body-sm font-mono text-light-on-surface-variant dark:text-dark-on-surface-variant">{author.address}</p>
      </header>
      
      <div className="bg-light-surface-container dark:bg-dark-surface-container rounded-2xl p-6 sm:p-8 border border-light-outline-variant dark:border-dark-outline-variant">
        <div className="border-b border-light-outline-variant dark:border-dark-outline-variant mb-6">
            <nav className="-mb-px flex gap-x-2 sm:gap-x-4" aria-label="Tabs">
                <TabButton isActive={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>{t.yourStats}</TabButton>
                <TabButton isActive={activeTab === 'identity'} onClick={() => setActiveTab('identity')}>{t.identity}</TabButton>
                <TabButton isActive={activeTab === 'delegation'} onClick={() => setActiveTab('delegation')}>{t.delegation}</TabButton>
                <TabButton isActive={activeTab === 'drafts'} onClick={() => setActiveTab('drafts')}>{t.yourDrafts}</TabButton>
                <TabButton isActive={activeTab === 'history'} onClick={() => setActiveTab('history')}>{t.publishHistory}</TabButton>
            </nav>
        </div>
        
        {renderContent()}

      </div>
    </div>
  );
};

export default DashboardView;