

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Article, View, Proposal, Author, SortOrder, Theme, Draft, PublishRequest, Subscription } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ArticleFeed from './components/ArticleFeed';
import ArticleView from './components/ArticleView';
import PublishView from './components/PublishView';
import GovernanceView from './components/GovernanceView';
import ProfileView from './components/ProfileView';
import LandingView from './components/LandingView';
import DashboardView from './components/DashboardView';
import SubscriptionCenterView from './components/SubscriptionCenterView';
import WhitepaperView from './components/WhitepaperView';
import Toast from './components/Toast';
import DonateModal from './components/DonateModal';
import { useI18n } from './contexts/I18nContext';
import { useWeb3 } from './contexts/Web3Context';
import { calculateImpactScore } from './utils/scoring';
import { apiClient, ipfs } from './services/apiClient';
import { ethers } from 'ethers';

// ----------------------------------------------
// URL helpers for shareable links
// ----------------------------------------------
const getArticleIdFromUrl = (): number | null => {
  const params = new URLSearchParams(window.location.search);
  const idStr = params.get('article');
  return idStr ? parseInt(idStr, 10) : null;
};


const App: React.FC = () => {
  const { t } = useI18n();
  const { signInWithEthereum, signOut, session } = useWeb3();

  const [view, setView] = useState<View>('landing');
  const [articles, setArticles] = useState<Article[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [authors, setAuthors] = useState<{ [key: string]: Author }>({});
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('trending');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('clarity-theme') as Theme) || 'dark');
  const [donationModalData, setDonationModalData] = useState<{ author: Author } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filterTag, setFilterTag] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const editingDraft = useMemo(() => drafts.find(d => d.id === editingDraftId) || null, [drafts, editingDraftId]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('clarity-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [articlesData, proposalsData, authorsData, subscriptionsData, draftsData] = await Promise.all([
                apiClient.getArticles(),
                apiClient.getProposals(),
                apiClient.getAuthors(),
                session ? apiClient.getSubscriptions(session.address) : Promise.resolve([]),
                // Only fetch drafts if user is signed in
                session ? apiClient.getDrafts(session.address) : Promise.resolve([]),
            ]);
            setArticles(articlesData);
            setProposals(proposalsData);
            setAuthors(authorsData);
            setDrafts(draftsData);
            setSubscriptions(subscriptionsData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            showToast("Failed to load platform data.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    fetchInitialData();
  }, [session]);

  useEffect(() => {
    const keeperInterval = setInterval(async () => {
        if (session) {
            console.log('[Keeper] Checking for expired subscriptions...');
            const updatedSubscriptions = await apiClient.runSubscriptionKeeper(session.address);
            setSubscriptions(updatedSubscriptions);
        }
    }, 60000); // Check every minute
    return () => clearInterval(keeperInterval);
  }, [session]);


  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };
  
  const handleNavigate = (newView: View, entityId: string | null = null) => {
    if (newView === 'publish') {
        setEditingDraftId(entityId);
    } else {
        setEditingDraftId(null);
    }
    
    if (newView === 'article' && entityId) {
        const article = articles.find(a => a.id === parseInt(entityId, 10));
        setSelectedArticle(article || null);
    } else {
        setSelectedArticle(null);
    }
    
    setSelectedAuthor(null);
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleSelectArticle = (article: Article) => {
    // Update URL with article parameter for shareable link
    const newUrl = `${window.location.pathname}?article=${article.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    setSelectedArticle(article);
    setView('article');
    window.scrollTo(0, 0);
  };

  // Handle deep-linking from shared URLs on load
  useEffect(() => {
    const articleId = getArticleIdFromUrl();
    if (articleId && articles.length > 0) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        handleSelectArticle(article);
      }
    }
  }, [articles]);

  // Handle deep-linking from shared URLs on load
  useEffect(() => {
    const articleId = getArticleIdFromUrl();
    if (articleId && articles.length > 0) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        handleSelectArticle(article);
      }
    }
  }, [articles]);
  
  const handleSelectAuthor = (author: Author) => {
    setSelectedAuthor(authors[author.address]);
    setView('profile');
    window.scrollTo(0, 0);
  };

  const { articleRegistryContract, journalistSbtContract, reputationManagerContract, daoControllerContract, subscriptionManagerContract } = useWeb3();

  const handleMintSbt = async () => {
    if (!session || !journalistSbtContract) {
      showToast('You must be signed in to mint an SBT.', 'error');
      return;
    }

    try {
      const tokenId = Date.now(); // Using timestamp as a temporary unique ID
      const tx = await journalistSbtContract.mint(session.address, tokenId);
      showToast(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait();

      // Update local state
      const updatedAuthor = await apiClient.mintSbt(session.address, tokenId);
      setAuthors(prev => ({ ...prev, [session.address]: updatedAuthor }));

      showToast('SBT minted successfully!', 'success');
    } catch (error) {
      console.error("SBT minting failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'SBT minting failed';
      showToast(errorMessage, 'error');
    }
  };

  const handleCreateProposal = async (title: string, description: string) => {
    if (!session || !daoControllerContract) {
      showToast('You must be signed in to create a proposal.', 'error');
      return;
    }

    try {
      const tx = await daoControllerContract.createProposal(title, description, 0); // Using 0 for duration as a placeholder
      showToast(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait();

      // Update local state
      const newProposal = await apiClient.createProposal(session.address, title, description);
      setProposals(prev => [newProposal, ...prev]);

      showToast('Proposal created successfully!', 'success');
    } catch (error) {
      console.error("Proposal creation failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Proposal creation failed';
      showToast(errorMessage, 'error');
    }
  };

  const handlePublishArticle = useCallback(async (publishRequest: PublishRequest) => {
    if (!session || !session.signer || !articleRegistryContract) {
        showToast('You must be signed in to publish.', 'error');
        return;
    }

    showToast(t.publishingToChain);

    try {
        // 1. Upload content to IPFS
        const contentBlob = new Blob([publishRequest.content], { type: 'text/plain' });
        const contentCid = await ipfs.add(contentBlob);

        // 2. Create and upload metadata to IPFS
        const metadata = {
            title: publishRequest.title,
            tags: publishRequest.tags,
            category: publishRequest.category,
            language: publishRequest.language,
            timestamp: new Date().toISOString(),
            contentCid: contentCid.path,
            author: session.address,
        };
        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const metadataCid = await ipfs.add(metadataBlob);

        // 3. Hash metadata and sign it
        const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));
        const signature = await session.signer.signMessage(ethers.getBytes(metadataHash));

        // 4. Register on-chain
        const tx = await articleRegistryContract.registerArticle(
            Date.now(), // Using timestamp as a temporary unique ID
            contentCid.path,
            metadataCid.path,
            signature
        );
        showToast(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
        await tx.wait();

        // 5. Update local state
        const { newArticle, updatedAuthor } = await apiClient.publishArticle({
            ...publishRequest,
            contentCid: contentCid.path,
            metadataCid: metadataCid.path,
            signature,
        });

        setArticles(prevArticles => [newArticle, ...prevArticles]);
        setAuthors(prev => ({ ...prev, [updatedAuthor.address]: updatedAuthor }));

        if (publishRequest.fromDraftId) {
            setDrafts(prev => prev.filter(d => d.id !== publishRequest.fromDraftId));
        }

        handleNavigate('home');
        showToast(t.articlePublished.replace('{tx}', tx.hash));

        // 6. Update reputation
        const newReputation = updatedAuthor.reputationScore;
        const repTx = await reputationManagerContract.updateReputation(session.address, newReputation);
        await repTx.wait();
        showToast('Reputation updated on-chain!', 'success');

    } catch (error) {
        console.error("Publishing failed:", error);
        const errorMessage = error instanceof Error ? error.message : t.aiContentRejected;
        showToast(errorMessage, 'error');
    }
}, [t, session, articleRegistryContract, reputationManagerContract]);

  const handleSaveDraft = async (draftData: Omit<Draft, 'authorAddress' | 'lastSaved'>) => {
    if (!session) return;
    const updatedDraft = await apiClient.saveDraft({ ...draftData, authorAddress: session.address });
    setDrafts(prev => {
        const existingDraftIndex = prev.findIndex(d => d.id === updatedDraft.id);
        if (existingDraftIndex > -1) {
            const updatedDrafts = [...prev];
            updatedDrafts[existingDraftIndex] = updatedDraft;
            return updatedDrafts;
        } else {
            return [...prev, updatedDraft];
        }
    });

    if (!editingDraftId) {
        setEditingDraftId(updatedDraft.id);
    }
    showToast(t.draftSaved, 'success');
  }
  
  const handleDeleteDraft = async (draftId: string) => {
    if(!session) return;
    await apiClient.deleteDraft(draftId, session.address);
    setDrafts(prev => prev.filter(d => d.id !== draftId));
    if (editingDraftId === draftId) {
        setEditingDraftId(null);
    }
    showToast(t.draftDeleted, 'success');
  }

  const handleConnect = async () => {
    try {
      await signInWithEthereum();
      showToast(t.walletConnected);
    } catch (err) {
      console.error("Error signing in:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('WALLET_NOT_FOUND')) {
        showToast(t.metamaskNotInstalled, 'error');
      } else {
        showToast(t.walletRejected, 'error');
      }
    }
  };

  const handleDisconnect = () => {
    signOut();
    showToast(t.walletDisconnected);
  };
  
  const handleVerifyArticle = async (articleId: number) => {
    if(!session) return;
    showToast(t.submittingVerification);
    const updatedArticle = await apiClient.verifyArticle(articleId, session.address);
    setArticles(prev => prev.map(a => a.id === articleId ? updatedArticle : a));
    showToast(t.verificationSuccess.replace('{tx}', `0x${Date.now().toString(16).slice(-6)}...`), 'success');
  };

  const handleFlagArticle = async (articleId: number, reason: string, stake: number) => {
    if(!session) return;
    showToast(t.stakingToFlag);
    const updatedArticle = await apiClient.flagArticle(articleId, session.address, reason, stake);
    setArticles(prev => prev.map(a => a.id === articleId ? updatedArticle : a));
    showToast(t.articleFlagged, 'success');
  };

  const handleSubscribe = async (authorAddress: string) => {
      if (!session || !subscriptionManagerContract) return;
      showToast(t.subscribingToAuthor);
      try {
        const tx = await subscriptionManagerContract.subscribe(authorAddress, 1, "USDC"); // Using 1 USDC as a placeholder
        showToast(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
        await tx.wait();

        const updatedSubscriptions = await apiClient.subscribe(session.address, authorAddress);
        setSubscriptions(updatedSubscriptions);
        showToast(t.subscriptionSuccess, 'success');
      } catch (error) {
        console.error("Subscription failed:", error);
        const errorMessage = error instanceof Error ? error.message : 'Subscription failed';
        showToast(errorMessage, 'error');
      }
  };
  
  const handleUnsubscribe = async (authorAddress: string) => {
    if (!session) return;
    const updatedSubscriptions = await apiClient.unsubscribe(session.address, authorAddress);
    setSubscriptions(updatedSubscriptions);
    showToast(t.unsubscribeSuccess, 'success');
  };
  
  const handleConfirmDonate = async (authorAddress: string, amount: number, supportProtocol: boolean, isAnonymous: boolean) => {
    if (!session) return;
    showToast(t.donatingToAuthor.replace('{amount}', `${amount}`));
    const { updatedAuthor, reputationGain, isAnon } = await apiClient.makeDonation({ donatorAddress: session.address, authorAddress, amount, supportProtocol, isAnonymous });

    setAuthors(prev => ({...prev, [authorAddress]: updatedAuthor }));
    setDonationModalData(null);

    let toastMessage = '';
    if (isAnon) {
        toastMessage = t.anonymousDonationSent;
    } else if (supportProtocol) {
      toastMessage = t.donationWithFee.replace('{amount}', amount.toString());
    } else {
      toastMessage = t.donationSent.replace('{rep}', `${reputationGain}`);
    }
    showToast(toastMessage, 'success');

    // Update reputation on-chain
    if (reputationManagerContract) {
        const newReputation = updatedAuthor.reputationScore;
        const repTx = await reputationManagerContract.updateReputation(authorAddress, newReputation);
        await repTx.wait();
        showToast('Author reputation updated on-chain!', 'success');
    }
  };

  const handleVote = async (proposalId: number, vote: 'for' | 'against') => {
    if(!session) return;
    showToast(t.castingVote);
    const updatedProposal = await apiClient.castVote({ proposalId, voterAddress: session.address, vote });
    setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
    showToast(t.voteCastSuccess.replace('{tx}', `0x${Date.now().toString(16).slice(-6)}...`), 'success');
  };

  const handleProtocolDonation = async () => {
    if (!session) return;
    showToast(t.donationToClarity);
    await apiClient.donateToProtocol(session.address);
    showToast(t.thankYouForSupport, 'success');
  };
  
  const handleVerifyZkKyc = async (authorAddress: string) => {
    const updatedAuthor = await apiClient.verifyZkKyc(authorAddress);
    setAuthors(prev => ({...prev, [authorAddress]: updatedAuthor }));
    showToast(t.zkKycSuccess, 'success');
  };

  const handleDelegateVote = async (delegateeAddress: string) => {
    if (!session) return;
    showToast(t.delegatingVote);
    const updatedAuthor = await apiClient.delegateVote(session.address, delegateeAddress);
    setAuthors(prev => ({...prev, [session.address]: updatedAuthor}));
    showToast(t.delegateVoteSuccess, 'success');
  }

  const handleShare = async (article: Article) => {
    const shareUrl = `${window.location.origin}?article=${article.id}`;
    const shareData = {
        title: article.title,
        text: article.content.substring(0, 100) + '...',
        url: shareUrl,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareUrl);
            showToast(t.linkCopied, 'success');
        }
    } catch (err) {
        console.error("Share failed:", err);
        showToast(t.shareFailed, 'error');
    }
  };

  const enhancedArticles = useMemo(() => {
    const subscribedAuthorAddresses = new Set(subscriptions.map(s => s.authorAddress));
    return articles.map(article => ({
        ...article,
        author: {
            ...authors[article.authorAddress],
            isSubscribed: subscribedAuthorAddresses.has(article.authorAddress)
        }
    }));
  }, [articles, authors, subscriptions]);
  
  const filteredArticles = useMemo(() => {
    let articlesToFilter = [...enhancedArticles];

    if (filterTag !== 'all') {
      articlesToFilter = articlesToFilter.filter(article => article.tags.includes(filterTag));
    }

    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        articlesToFilter = articlesToFilter.filter(article => 
            article.title.toLowerCase().includes(lowercasedQuery) ||
            article.content.toLowerCase().includes(lowercasedQuery) ||
            article.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
        );
    }
    return articlesToFilter;
  }, [enhancedArticles, searchQuery, filterTag]);

  const sortedArticles = useMemo(() => {
    const articlesToSort = [...filteredArticles];
    switch(sortOrder) {
      case 'latest':
        return articlesToSort.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case 'trust':
        return articlesToSort.sort((a, b) => calculateImpactScore(b) - calculateImpactScore(a));
      case 'reputation':
        return articlesToSort.sort((a, b) => b.author.reputationScore - a.author.reputationScore);
      case 'trending':
      default:
        return articlesToSort.sort((a, b) => b.verifications - a.verifications);
    }
  }, [filteredArticles, sortOrder]);
  
  const userDrafts = useMemo(() => {
      if (!session) return [];
      return drafts.filter(d => d.authorAddress === session.address).sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime());
  }, [drafts, session]);

  const userArticles = useMemo(() => {
    if (!session) return [];
    return enhancedArticles
      .filter(a => a.author.address === session.address)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [enhancedArticles, session]);
  
  const dashboardStats = useMemo(() => {
      const user = session ? authors[session.address] : null;
      if (!user) return null;
      return {
          author: user,
          totalArticles: articles.filter(a => a.authorAddress === session.address).length,
          totalVerifications: articles.reduce((sum, a) => a.authorAddress === session.address ? sum + a.verifications : sum, 0),
      }
  }, [session, authors, articles]);

  const subscribedAuthors = useMemo(() => {
      return subscriptions.map(s => authors[s.authorAddress]).filter(Boolean);
  }, [subscriptions, authors]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const renderView = () => {
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><p className="text-body-lg text-light-on-surface/80 dark:text-dark-on-surface/80">Loading Clarity...</p></div>;
    }

    switch(view) {
      case 'landing':
        return <LandingView onEnter={() => handleNavigate('home')} />;
      case 'whitepaper':
        return <WhitepaperView />;
      case 'home':
        return <ArticleFeed 
                  articles={sortedArticles}
                  allArticles={enhancedArticles}
                  onSelectArticle={handleSelectArticle}
                  onSelectAuthor={handleSelectAuthor}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  filterTag={filterTag}
                  onFilterTagChange={setFilterTag}
                  searchQuery={searchQuery}
                />;
      case 'article':
        if (!selectedArticle) return null;
        const completeArticle = enhancedArticles.find(a => a.id === selectedArticle.id)
        if (!completeArticle) return null;
        return <ArticleView 
                  article={completeArticle}
                  onBack={() => handleNavigate('home')}
                  onSelectAuthor={handleSelectAuthor}
                  session={session}
                  onVerifyArticle={handleVerifyArticle}
                  onFlagArticle={handleFlagArticle}
                  onOpenDonateModal={() => setDonationModalData({ author: completeArticle.author })}
                  onSubscribe={handleSubscribe}
                  onShare={handleShare}
                />;
      case 'publish':
        return <PublishView 
                  onPublish={handlePublishArticle}
                  onSaveDraft={handleSaveDraft}
                  draftToEdit={editingDraft}
                  session={session}
                  onConnectWallet={handleConnect}
                  showToast={showToast}
                />
      case 'governance':
        return <GovernanceView 
                  proposals={proposals} 
                  session={session} 
                  onVote={handleVote} 
                  onCreateProposal={handleCreateProposal}
                />;
      case 'profile':
        if (!selectedAuthor) return null;
        const subscribedAuthorAddresses = new Set(subscriptions.map(s => s.authorAddress));
        return <ProfileView 
                  author={{...selectedAuthor, isSubscribed: subscribedAuthorAddresses.has(selectedAuthor.address)}}
                  articles={enhancedArticles.filter(a => a.author.address === selectedAuthor.address)}
                  onSelectArticle={handleSelectArticle}
                  onBack={() => handleNavigate('home')}
                  onSubscribe={handleSubscribe}
                />;
      case 'dashboard':
          if (!session || !dashboardStats) return <div className="text-center py-10">Please sign in to view your dashboard.</div>;
          return <DashboardView 
                    stats={dashboardStats} 
                    drafts={userDrafts} 
                    articles={userArticles}
                    onNavigate={handleNavigate}
                    onDeleteDraft={handleDeleteDraft}
                    onVerifyZkKyc={handleVerifyZkKyc}
                    onDelegateVote={handleDelegateVote}
                    onMintSbt={handleMintSbt}
                    walletAddress={session.address}
                  />
      case 'subscription':
          return <SubscriptionCenterView 
                    subscribedAuthors={subscribedAuthors} 
                    onUnsubscribe={handleUnsubscribe}
                    onSelectAuthor={handleSelectAuthor}
                  />;
      default:
        return <ArticleFeed 
                  articles={sortedArticles}
                  allArticles={enhancedArticles}
                  onSelectArticle={handleSelectArticle}
                  onSelectAuthor={handleSelectAuthor}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  filterTag={filterTag}
                  onFilterTagChange={setFilterTag}
                  searchQuery={searchQuery}
                />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface font-sans transition-colors duration-300">
      {view !== 'landing' && (
        <Header 
          onNavigate={handleNavigate}
          session={session}
          onConnectWallet={handleConnect}
          onDisconnectWallet={handleDisconnect}
          theme={theme}
          toggleTheme={toggleTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      
      <main className={`flex-grow ${view !== 'landing' ? 'container mx-auto px-4 sm:px-6 py-8' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (selectedArticle?.id || '') + (selectedAuthor?.address || '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {view !== 'landing' && <Footer walletAddress={session?.address || null} onDonate={handleProtocolDonation} />}
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <AnimatePresence>
        {donationModalData && (
          <DonateModal 
            author={donationModalData.author}
            onClose={() => setDonationModalData(null)}
            onConfirmDonate={handleConfirmDonate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;