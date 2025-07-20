

import { Author, Proposal, ProposalStatus, Subscription } from '../../types';

export const MOCK_AUTHORS_RAW: { [key: string]: Author } = {
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': {
    address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    pseudonym: 'Veritas',
    reputationScore: 1540,
    totalDonations: 3500,
    votesCasted: 42,
    isZkVerified: true,
    delegatedTo: null,
    activity: [
      { type: 'joined', detail: 'Account created', timestamp: new Date(Date.now() - 86400000 * 30).toISOString()},
      { type: 'publish', detail: 'Article #2', timestamp: new Date().toISOString()},
      { type: 'vote', detail: 'Proposal #1', timestamp: new Date(Date.now() - 86400000 * 2).toISOString()},
    ],
  },
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    pseudonym: 'The Observer',
    reputationScore: 890,
    totalDonations: 1200,
    votesCasted: 15,
    isZkVerified: false,
    delegatedTo: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
     activity: [
      { type: 'joined', detail: 'Account created', timestamp: new Date(Date.now() - 86400000 * 50).toISOString()},
      { type: 'publish', detail: 'Article #3', timestamp: new Date(Date.now() - 86400000 * 5).toISOString()},
    ],
  },
  '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4': {
    address: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4',
    pseudonym: 'CypherPunk',
    reputationScore: 2150,
    totalDonations: 8500,
    votesCasted: 88,
    isZkVerified: true,
    delegatedTo: null,
    activity: [
      { type: 'joined', detail: 'Account created', timestamp: new Date(Date.now() - 86400000 * 100).toISOString()},
      { type: 'publish', detail: 'Article #1', timestamp: new Date(Date.now() - 86400000 * 2).toISOString()},
      { type: 'donation', detail: '+500 rep', timestamp: new Date(Date.now() - 86400000 * 10).toISOString()},
      { type: 'vote', detail: 'Proposal #2', timestamp: new Date(Date.now() - 86400000 * 4).toISOString()},
    ],
  }
};

type RawArticle = {
  id: number;
  title: string;
  content: string;
  authorAddress: string;
  timestamp: string;
  verifications: number;
  tags: string[];
  isFlagged: boolean;
  flags: { staker: string; stake: number; reason: string }[],
  isWatermarked: boolean;
  contentCid: string;
  metadataCid: string;
  signature: string;
}

export const MOCK_ARTICLES_RAW: RawArticle[] = [
  {
    id: 1,
    title: 'Decentralized AI: The Next Frontier in Machine Learning',
    content: `
<h1>The Dawn of a New AI Era</h1>
<p>For decades, Artificial Intelligence has been dominated by a few tech giants. Their vast resources allowed them to build massive, centralized models trained on equally massive datasets. While this approach has yielded impressive results, it has also created significant problems:</p>
<ul>
  <li><strong>Data Privacy:</strong> Users trade their data for "free" services, often without fully understanding how it's used.</li>
  <li><strong>Censorship and Bias:</strong> Centralized control means a single entity can decide what information is permissible and can perpetuate biases present in their training data.</li>
  <li><strong>Lack of Access:</strong> The immense computational power required to train state-of-the-art models is out of reach for most researchers and startups.</li>
</ul>
<h2>Enter Decentralization</h2>
<p>Blockchain and other peer-to-peer technologies offer a compelling alternative. A decentralized approach to AI could involve...</p>
`,
    authorAddress: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    verifications: 284,
    tags: ['AI', 'decentralization', 'blockchain', 'privacy'],
    isFlagged: false,
    flags: [],
    isWatermarked: true,
    contentCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    metadataCid: 'bafybeihhmsxuue2nh3yf4g25u32afu75s5a5lvp5o5d2h3b2y2j4y2xeq',
    signature: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    id: 2,
    title: 'The Unseen Risks of Central Bank Digital Currencies (CBDCs)',
    content: `
<h2>The Promise and Peril of CBDCs</h2>
<p>Central Bank Digital Currencies, or CBDCs, are digital versions of a country's fiat currency. Proponents argue they can improve payment systems, reduce transaction costs, and enhance financial inclusion. However, a closer look reveals potential downsides that could reshape the relationship between citizen and state.</p>
<blockquote>A programmable currency is the ultimate tool of social control.</blockquote>
<p>Unlike cash, which is anonymous, a CBDC would give central banks a direct view into every transaction made by every citizen...</p>
`,
    authorAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    timestamp: new Date().toISOString(), // Today
    verifications: 531,
    tags: ['CBDC', 'finance', 'privacy', 'surveillance'],
    isFlagged: true,
    flags: [{staker: '0xAnotherUser', stake: 500, reason: 'Contains unsubstantiated claims.'}],
    isWatermarked: false,
    contentCid: 'bafybeif4t5tr6wz4qkmnq44x56k5z6z5y7q3x3c5y6b7b2z2e4a4z3y3x',
    metadataCid: 'bafybeifakecidstringfortestingpurposesonlyandnothingelsematter',
    signature: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c'
  },
];

export const MOCK_PROPOSALS_RAW: Proposal[] = [
  {
    id: 1,
    title: 'Increase Staking Requirement for Article Flagging',
    type: 'Protocol Parameter Change',
    description: 'This proposal suggests increasing the minimum token stake required to flag an article from 500 to 1000 CLARITY tokens. The goal is to reduce frivolous flagging and ensure that only serious concerns are raised.',
    status: 'active' as ProposalStatus,
    votesFor: 1250000,
    votesAgainst: 340000,
    endDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    creator: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4',
  },
  {
    id: 2,
    title: 'Fund a Grant for Multilingual Glossary Expansion',
    type: 'Community Grant',
    description: 'Allocate 50,000 protocol tokens to a community grant for translating and expanding the glossary of technical terms into 5 new languages, improving accessibility for non-English speakers.',
    status: 'passed' as ProposalStatus,
    votesFor: 2800000,
    votesAgainst: 150000,
    endDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    creator: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  },
  {
    id: 3,
    title: 'Resolve Flagged Article: "The Unseen Risks of CBDCs"',
    type: 'Dispute Resolution',
    description: 'This proposal is to vote on the validity of the flag against article "The Unseen Risks of CBDCs". A "For" vote upholds the flag (article remains flagged), while an "Against" vote removes it (article is cleared).',
    status: 'active' as ProposalStatus,
    votesFor: 45000,
    votesAgainst: 89000,
    endDate: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    creator: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4'
  },
];

export const MOCK_SUBSCRIPTIONS_RAW: Subscription[] = [
    // This subscription is active
    {
        subscriberAddress: '0xMockUser', // A mock user for whom we can fetch subscriptions
        authorAddress: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4',
        expiry: new Date(Date.now() + 86400000 * 15).toISOString(), // Expires in 15 days
    },
    // This subscription has expired and will be filtered out by the keeper
    {
        subscriberAddress: '0xMockUser',
        authorAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        expiry: new Date(Date.now() - 86400000 * 2).toISOString(), // Expired 2 days ago
    }
];