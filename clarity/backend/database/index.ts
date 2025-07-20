

import { Article, Author, Proposal, Draft, Subscription } from '../../types';
import { MOCK_ARTICLES_RAW, MOCK_AUTHORS_RAW, MOCK_PROPOSALS_RAW, MOCK_SUBSCRIPTIONS_RAW } from './mockData';

// --- In-Memory Database State ---

let articles: Article[] = [];
let authors: { [key: string]: Author } = MOCK_AUTHORS_RAW;
let proposals: Proposal[] = MOCK_PROPOSALS_RAW;
let drafts: { [authorAddress: string]: Draft[] } = {};
let subscriptions: Subscription[] = MOCK_SUBSCRIPTIONS_RAW;
let nextArticleId = MOCK_ARTICLES_RAW.length + 1;


// --- Hydrate Data ---
const hydrateArticle = (rawArticle: any): Article => ({
    ...rawArticle,
    author: authors[rawArticle.authorAddress],
});

const hydrateAllArticles = () => {
    articles = MOCK_ARTICLES_RAW.map(hydrateArticle);
};

hydrateAllArticles(); // Initial hydration

// --- Database Access Functions ---

// Articles
export const getArticles = (): Article[] => [...articles].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
export const getArticle = (id: number): Article | undefined => articles.find(a => a.id === id);
export const addArticle = (articleData: Omit<Article, 'id' | 'author'>): Article => {
    const author = authors[articleData.authorAddress];
    if (!author) throw new Error("Cannot add article: Author not found");
    
    const newArticle: Article = { 
        ...articleData, 
        id: nextArticleId++,
        author 
    };
    articles = [newArticle, ...articles];
    
    // Add activity to author
    const newActivity = { type: 'publish', detail: `Article #${newArticle.id}`, timestamp: new Date().toISOString() };
    const updatedActivity = [...(author.activity || []), newActivity];
    updateAuthor(author.address, { activity: updatedActivity });

    return newArticle;
};
export const updateArticle = (id: number, updates: Partial<Article>) => {
    articles = articles.map(a => a.id === id ? hydrateArticle({ ...a, ...updates }) : a);
};

// Authors
export const getAuthors = (): { [key: string]: Author } => ({ ...authors });
export const getAuthor = (id: string): Author | undefined => authors[id];
export const addAuthor = (author: Author) => {
    authors[author.address] = author;
};
export const updateAuthor = (id:string, updates: Partial<Author>): Author => {
    authors[id] = { ...authors[id], ...updates };
    hydrateAllArticles(); // Re-hydrate articles in case author reputation changed
    return authors[id];
};

// Proposals
export const getProposals = (): Proposal[] => [...proposals];
export const getProposal = (id: number): Proposal | undefined => proposals.find(p => p.id === id);
export const updateProposal = (id: number, updates: Partial<Proposal>) => {
    proposals = proposals.map(p => p.id === id ? { ...p, ...updates } : p);
};

// Drafts
export const getDrafts = (authorAddress: string): Draft[] => drafts[authorAddress] ? [...drafts[authorAddress]] : [];
export const saveDraft = (draft: Draft) => {
    if (!drafts[draft.authorAddress]) {
        drafts[draft.authorAddress] = [];
    }
    const userDrafts = drafts[draft.authorAddress];
    const index = userDrafts.findIndex(d => d.id === draft.id);
    if (index > -1) {
        userDrafts[index] = draft;
    } else {
        userDrafts.push(draft);
    }
};
export const deleteDraft = (id: string, authorAddress: string) => {
    if (drafts[authorAddress]) {
        drafts[authorAddress] = drafts[authorAddress].filter(d => d.id !== id);
    }
};

// Subscriptions
export const getSubscriptionsFor = (subscriberAddress: string): Subscription[] => {
    return subscriptions.filter(s => s.subscriberAddress === subscriberAddress && new Date(s.expiry) > new Date());
};

export const addSubscription = (subscriberAddress: string, authorAddress: string) => {
    const existingIndex = subscriptions.findIndex(s => s.subscriberAddress === subscriberAddress && s.authorAddress === authorAddress);
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

    if (existingIndex > -1) {
        subscriptions[existingIndex].expiry = expiry;
    } else {
        subscriptions.push({ subscriberAddress, authorAddress, expiry });
    }
};

export const removeSubscription = (subscriberAddress: string, authorAddress: string) => {
    subscriptions = subscriptions.filter(s => !(s.subscriberAddress === subscriberAddress && s.authorAddress === authorAddress));
};

export const checkExpiredSubscriptions = () => {
    const now = new Date();
    // In a real DB, you'd just delete expired rows. Here we filter.
    const activeSubs = subscriptions.filter(s => new Date(s.expiry) > now);
    if (activeSubs.length < subscriptions.length) {
        console.log(`[Keeper] Deactivated ${subscriptions.length - activeSubs.length} expired subscriptions.`);
        subscriptions = activeSubs;
    }
};