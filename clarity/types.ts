

export interface Author {
  address: string;
  pseudonym?: string;
  sbtTokenId?: number | null;
  reputationScore: number;
  totalDonations?: number;
  votesCasted?: number;
  endorsements?: string[];
  activity?: { type: string; detail: string; timestamp: string }[];
  isZkVerified?: boolean;
  isSubscribed?: boolean;
  delegatedTo?: string | null;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  authorAddress: string;
  author: Author;
  timestamp: string;
  verifications: number;
  tags: string[];
  isFlagged: boolean;
  flags: { staker: string; stake: number; reason: string }[];
  isWatermarked: boolean;
  contentCid: string;
  metadataCid: string;
  signature: string;
}

export interface PublishRequest {
    authorAddress: string;
    title: string;
    content: string; // HTML content from Tiptap
    tags: string[];
    language: string;
    category: string;
    applyWatermark: boolean;
    fromDraftId?: string;
}

export interface Draft {
  id: string;
  authorAddress: string;
  title: string;
  content: string;
  tags: string[];
  language: string;
  category: string;
  lastSaved: string;
}

export interface Subscription {
    subscriberAddress: string;
    authorAddress: string;
    expiry: string;
}


export type View = 'home' | 'article' | 'publish' | 'governance' | 'profile' | 'landing' | 'dashboard' | 'subscription' | 'whitepaper';

export type SortOrder = 'latest' | 'trust' | 'reputation' | 'trending';

export type ProposalStatus = 'active' | 'passed' | 'failed' | 'executed' | 'closed';

export interface Proposal {
  id: number;
  title: string;
  type: string;
  description: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  endDate: string;
  userVote?: 'for' | 'against';
  creator: string;
}

export interface SiweSession {
    address: string;
    chainId: number;
}

export type Theme = 'light' | 'dark';