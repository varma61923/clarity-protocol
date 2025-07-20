

import { PublishRequest, Article, Author, Draft, Proposal, Subscription } from '../types';
import * as db from './database';
import { aiContentCheckService, ipfsService, zkWatermarkingService, ClarityConfig } from './services/clarityService';
import { SiweMessage } from 'siwe';

// --- Simulation Helpers ---

const simulateTransaction = (duration: number = 800) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};


// --- API Functions ---

// GET /config
export const getConfig = () => {
    return {
        supportedLanguages: ClarityConfig.supportedLanguages,
        categories: ClarityConfig.categories,
    }
}

// GET /articles
export const getArticles = async () => {
    await simulateTransaction(200);
    return db.getArticles();
}

// GET /proposals
export const getProposals = async () => {
    await simulateTransaction(150);
    return db.getProposals();
}

// GET /authors
export const getAuthors = async () => {
    await simulateTransaction(100);
    return db.getAuthors();
}

// GET /drafts
export const getDrafts = async (authorAddress: string) => {
    await simulateTransaction(50);
    return db.getDrafts(authorAddress);
}

// GET /subscriptions
export const getSubscriptions = async (subscriberAddress: string): Promise<Subscription[]> => {
    await simulateTransaction(50);
    return db.getSubscriptionsFor(subscriberAddress);
}


// POST /articles
export const publishArticle = async (request: PublishRequest) => {
    const { authorAddress, title, content, tags, language, category, applyWatermark, fromDraftId } = request;

    const isHuman = await aiContentCheckService.isHumanAuthored(content);
    if (!isHuman) {
        throw new Error('Content rejected: Suspected AI-generated text.');
    }
    
    await simulateTransaction(2000);

    const finalContent = applyWatermark ? zkWatermarkingService.applyWatermark(content) : content;
    
    const articleContentCid = await ipfsService.pin({ content: finalContent });

    const metadata = {
        title,
        contentCid: articleContentCid,
        tags,
        language,
        category,
        authorAddress,
        publishedAt: new Date().toISOString(),
        signature: '0x' + Math.random().toString(16).slice(2) // Mock signature
    };
    const metadataCid = await ipfsService.pin(metadata);
    
    const author = db.getAuthor(authorAddress);
    if (!author) throw new Error("Author not found");

    const newArticleData = {
        title,
        content: finalContent,
        tags,
        authorAddress,
        timestamp: metadata.publishedAt,
        verifications: 0,
        isFlagged: false,
        flags: [],
        isWatermarked: applyWatermark,
        contentCid: articleContentCid,
        metadataCid: metadataCid,
        signature: metadata.signature
    };
    
    const newArticle = db.addArticle(newArticleData);
    
    const updatedAuthor = db.updateAuthor(authorAddress, { reputationScore: author.reputationScore + 10 });

    if (fromDraftId) {
        db.deleteDraft(fromDraftId, authorAddress);
    }
    
    return { newArticle, updatedAuthor };
}

// POST /authors
export const createAuthor = async (authorAddress: string) => {
    const newAuthor: Author = {
        address: authorAddress,
        reputationScore: 100,
        totalDonations: 0,
        votesCasted: 0,
        isZkVerified: false,
        activity: [{ type: 'joined', detail: 'Account created', timestamp: new Date().toISOString() }],
        delegatedTo: null,
    };
    db.addAuthor(newAuthor);
    await simulateTransaction(100);
    return newAuthor;
}

// GET /authors/:id/exists
export const authorExists = async (authorAddress: string) => {
    await simulateTransaction(50);
    return !!db.getAuthor(authorAddress);
}

// POST /drafts
export const saveDraft = async (draftData: Omit<Draft, 'lastSaved'>) => {
    const draft: Draft = {
        ...draftData,
        lastSaved: new Date().toISOString()
    }
    db.saveDraft(draft);
    await simulateTransaction(300);
    return draft;
}

// DELETE /drafts/:id
export const deleteDraft = async (draftId: string, authorAddress: string) => {
    db.deleteDraft(draftId, authorAddress);
    await simulateTransaction(200);
    return { success: true };
}

// POST /articles/:id/verify
export const verifyArticle = async (articleId: number, verifierAddress: string) => {
    await simulateTransaction();
    const article = db.getArticle(articleId);
    if (!article) throw new Error("Article not found");
    const updatedArticleData = { ...article, verifications: article.verifications + 1 };
    db.updateArticle(articleId, updatedArticleData);
    return db.getArticle(articleId)!;
}

// POST /articles/:id/flag
export const flagArticle = async (articleId: number, flaggerAddress: string, reason: string, stake: number) => {
    await simulateTransaction();
    const article = db.getArticle(articleId);
    if (!article) throw new Error("Article not found");
    
    const newFlag = { staker: flaggerAddress, reason, stake };
    const updatedFlags = [...article.flags, newFlag];
    const updatedArticleData = { ...article, isFlagged: true, flags: updatedFlags };

    db.updateArticle(articleId, updatedArticleData);
    return db.getArticle(articleId)!;
}

// POST /subscriptions
export const subscribe = async (subscriberAddress: string, authorAddress: string) => {
    await simulateTransaction();
    db.addSubscription(subscriberAddress, authorAddress);
    return db.getSubscriptionsFor(subscriberAddress);
}

// DELETE /subscriptions/:id
export const unsubscribe = async (subscriberAddress: string, authorAddress: string) => {
    await simulateTransaction(500);
    db.removeSubscription(subscriberAddress, authorAddress);
    return db.getSubscriptionsFor(subscriberAddress);
}

// POST /keeper/subscriptions
export const runSubscriptionKeeper = async (subscriberAddress: string) => {
    console.log("[Keeper] Running subscription check in backend...");
    await simulateTransaction(100);
    db.checkExpiredSubscriptions();
    return db.getSubscriptionsFor(subscriberAddress);
};

// POST /donations
export const makeDonation = async (donation: { donatorAddress: string, authorAddress: string, amount: number, supportProtocol: boolean, isAnonymous: boolean }) => {
    const { authorAddress, amount, supportProtocol, isAnonymous } = donation;
    
    if (isAnonymous) {
        await simulateTransaction(3500); // Simulate ZK steps
    } else {
        await simulateTransaction();
    }

    const feeBps = ClarityConfig.governance.donationFeeBps;
    const fee = supportProtocol ? (amount * feeBps) / 10000 : 0;
    const authorAmount = amount - fee;
    
    const author = db.getAuthor(authorAddress);
    if(!author) throw new Error("Author not found");

    const reputationGain = Math.round(authorAmount / 10);
    const updatedAuthor = db.updateAuthor(authorAddress, {
        totalDonations: (author.totalDonations || 0) + authorAmount,
        reputationScore: author.reputationScore + reputationGain
    });
    
    return { updatedAuthor, reputationGain, isAnon: isAnonymous };
}

// POST /protocol-donations
export const donateToProtocol = async (donatorAddress: string) => {
    await simulateTransaction();
    console.log(`Donation from ${donatorAddress} to protocol treasury processed.`);
    return { success: true };
}

// POST /votes
export const castVote = async (payload: {proposalId: number, voterAddress: string, vote: 'for' | 'against'}) => {
    const { proposalId, voterAddress, vote } = payload;
    await simulateTransaction();
    const proposal = db.getProposal(proposalId);
    if(!proposal) throw new Error("Proposal not found");

    // This is a simplified vote count; a real system would use token-weighted voting
    const updatedProposalData: Partial<Proposal> = {
        votesFor: vote === 'for' ? proposal.votesFor + 1 : proposal.votesFor,
        votesAgainst: vote === 'against' ? proposal.votesAgainst + 1 : proposal.votesAgainst,
        userVote: vote,
    };
    
    const voter = db.getAuthor(voterAddress);
    if(voter) {
        db.updateAuthor(voterAddress, { votesCasted: (voter.votesCasted || 0) + 1 });
    }

    db.updateProposal(proposalId, updatedProposalData);
    return db.getProposal(proposalId)!;
}

// POST /authors/:id/verify-zk
export const verifyZkKyc = async (authorAddress: string) => {
    await simulateTransaction(3000); // Simulate ZK verification process
    const author = db.getAuthor(authorAddress);
    if (!author) throw new Error("Author not found");
    const updatedAuthor = db.updateAuthor(authorAddress, { isZkVerified: true });
    return updatedAuthor;
}

// POST /authors/:id/delegate
export const delegateVote = async (delegatorAddress: string, delegateeAddress: string) => {
    await simulateTransaction();
    const author = db.getAuthor(delegatorAddress);
    if (!author) throw new Error("Delegator not found");

    if (delegateeAddress && delegateeAddress.trim() !== '') {
        const delegatee = db.getAuthor(delegateeAddress);
        if(!delegatee) throw new Error("Delegatee address not found");
    }

    const updatedAuthor = db.updateAuthor(delegatorAddress, { delegatedTo: delegateeAddress || null });
    return updatedAuthor;
}