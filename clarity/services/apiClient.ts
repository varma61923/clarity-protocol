

import * as api from '../backend/api';

/**
 * This is the frontend's API client.
 * It's the single bridge between the UI components and the simulated backend.
 * It simply re-exports the backend functions to make them available
 * to the frontend in a clean, organized way.
 */
export const apiClient = {
  // Config
  getConfig: api.getConfig,

  // Article-related
  getArticles: api.getArticles,
  publishArticle: api.publishArticle,
  verifyArticle: api.verifyArticle,
  flagArticle: api.flagArticle,

  // Author-related
  getAuthors: api.getAuthors,
  authorExists: api.authorExists,
  createAuthor: api.createAuthor,
  verifyZkKyc: api.verifyZkKyc,
  delegateVote: api.delegateVote,

  // Proposal-related
  getProposals: api.getProposals,
  castVote: api.castVote,

  // Draft-related
  getDrafts: api.getDrafts,
  saveDraft: api.saveDraft,
  deleteDraft: api.deleteDraft,

  // Subscription-related
  getSubscriptions: api.getSubscriptions,
  subscribe: api.subscribe,
  unsubscribe: api.unsubscribe,
  runSubscriptionKeeper: api.runSubscriptionKeeper,

  // Donation-related
  makeDonation: api.makeDonation,
  donateToProtocol: api.donateToProtocol,
};