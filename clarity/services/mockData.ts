
import { Article, Author, Proposal, ProposalStatus } from '../types';

export const MOCK_AUTHORS: { [key: string]: Author } = {
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': {
    address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    reputationScore: 1540,
    totalDonations: 3500,
    votesCasted: 42,
    isZkVerified: true,
  },
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    reputationScore: 890,
    totalDonations: 1200,
    votesCasted: 15,
    isZkVerified: false,
  },
  '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4': {
    address: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4',
    reputationScore: 2150,
    totalDonations: 8500,
    votesCasted: 88,
    isZkVerified: true,
  }
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Decentralized AI: The Next Frontier in Machine Learning',
    content: `
# The Dawn of a New AI Era

For decades, Artificial Intelligence has been dominated by a few tech giants. Their vast resources allowed them to build massive, centralized models trained on equally massive datasets. While this approach has yielded impressive results, it has also created significant problems:

*   **Data Privacy:** Users trade their data for "free" services, often without fully understanding how it's used.
*   **Censorship and Bias:** Centralized control means a single entity can decide what information is permissible and can perpetuate biases present in their training data.
*   **Lack of Access:** The immense computational power required to train state-of-the-art models is out of reach for most researchers and startups.

## Enter Decentralization

Blockchain and other peer-to-peer technologies offer a compelling alternative. A decentralized approach to AI could involve:

1.  **Federated Learning:** Training models across multiple decentralized devices or servers holding local data samples, without exchanging the data itself. This enhances privacy.
2.  **Incentivized Data Sharing:** Using crypto-economic models to reward users for contributing high-quality data to training sets, with full transparency and control.
3.  **Open-Source Models:** Creating truly open and accessible models that anyone can use, audit, and build upon.

### The Challenges Ahead

Of course, the path to decentralized AI is not without its obstacles. Scalability, security against malicious actors, and developing robust incentive mechanisms are all significant hurdles. However, the potential rewards—a more democratic, private, and innovative AI landscape—make it a frontier worth exploring. The use of technologies like **zk-KYC** can verify data sources without revealing identities, while a **DAO** could govern model development and updates.
    `,
    authorAddress: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4',
    author: MOCK_AUTHORS['0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4'],
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    verifications: 284,
    tags: ['AI', 'decentralization', 'blockchain', 'privacy'],
    isFlagged: false,
    flags: [],
    isWatermarked: true,
    contentCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    metadataCid: 'bafybeihhmsxuue2nh3yf4g25u32afu75s5a5lvp5o5d2h3b2y2j4y2xeq',
    signature: '0x123'
  },
  {
    id: 2,
    title: 'The Unseen Risks of Central Bank Digital Currencies (CBDCs)',
    content: `
## The Promise and Peril of CBDCs

Central Bank Digital Currencies, or CBDCs, are digital versions of a country's fiat currency. Proponents argue they can improve payment systems, reduce transaction costs, and enhance financial inclusion. However, a closer look reveals potential downsides that could reshape the relationship between citizen and state.

> A programmable currency is the ultimate tool of social control.

Unlike cash, which is anonymous, a CBDC would give central banks a direct view into every transaction made by every citizen. This raises critical questions:

- **Programmable Money:** Could a government restrict what you can buy? Could they "expire" your savings to stimulate spending?
- **Surveillance:** A complete transaction history creates an unprecedented level of surveillance, chilling free speech and association.
- **Financial Exclusion:** What happens to those who cannot or will not use the digital system? They could be cut off from the economy entirely.

While the technology is neutral, its implementation is political. It is crucial for citizens to demand robust privacy protections, such as zero-knowledge proofs, and clear legal frameworks that limit the power of the state before these systems are rolled out. A **blockchain** based system could offer more transparency, but only if designed with the user's rights in mind.
    `,
    authorAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    author: MOCK_AUTHORS['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'],
    timestamp: new Date().toISOString(), // Today
    verifications: 531,
    tags: ['CBDC', 'finance', 'privacy', 'surveillance'],
    isFlagged: true,
    flags: [],
    isWatermarked: false,
    contentCid: 'bafybeihhtmsxuue2nh3yf4g25u32afu75s5a5lvp5o5d2h3b2y2j4y2xeq',
    metadataCid: 'bafybeihhmsxuue2nh3yf4g25u32afu75s5a5lvp5o5d2h3b2y2j4y2xfa',
    signature: '0x456'
  },
  {
    id: 3,
    title: 'Soulbound Tokens (SBTs): A New Paradigm for Digital Identity',
    content: `
### What are Soulbound Tokens?

First proposed by Ethereum co-founder Vitalik Buterin, **SBTs** are a new type of token that, once issued to a digital wallet (a "Soul"), cannot be traded or sold. This non-transferability is their key feature.

Imagine a world where your university degree, your driver's license, and your professional certifications are all verifiable credentials in your digital **wallet**. This is the promise of SBTs.

*   **Trust and Reputation:** They can build a rich, verifiable reputation system. For example, a **DAO** could issue SBTs to members who have a strong voting record.
*   **Preventing Fraud:** Since they can't be sold, they are more resistant to fraud and impersonation than traditional identity documents.
*   **Unlocking New Possibilities:** SBTs could enable new forms of governance, undercollateralized lending based on reputation, and more personalized Web3 experiences.

The CLARITY protocol itself uses SBTs to verify its journalists, ensuring that only those who have met the required standards can publish, without revealing their real-world identity thanks to **zk-KYC**. This combination of technologies builds a system of anonymous trust.
    `,
    authorAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    author: MOCK_AUTHORS['0xdAC17F958D2ee523a2206206994597C13D831ec7'],
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    verifications: 152,
    tags: ['identity', 'web3', 'SBTs', 'DAO'],
    isFlagged: false,
    flags: [],
    isWatermarked: false,
    contentCid: 'bafybeif4t5tr6wz4qkmnq44x56k5z6z5y7q3x3c5y6b7b2z2e4a4z3y3x',
    metadataCid: 'bafybeihhmsxuue2nh3yf4g25u32afu75s5a5lvp5o5d2h3b2y2j4y2xee',
    signature: '0x789'
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
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
    creator: '0x7D1AfA7B718fb893dB30A3aBc0C458d9C091D0C4',
  },
    {
    id: 4,
    title: 'Integrate a ZK-based Anonymous Donation System',
    type: 'Protocol Upgrade',
    description: 'This proposal failed to reach quorum. It suggested integrating a new smart contract to enable fully anonymous donations using zero-knowledge proofs, enhancing donor privacy.',
    status: 'failed' as ProposalStatus,
    votesFor: 980000,
    votesAgainst: 910000,
    endDate: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 days ago
    creator: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
];
