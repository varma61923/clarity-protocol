import React from 'react';
import { useI18n } from '../contexts/I18nContext';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-headline-sm font-bold text-light-on-surface dark:text-dark-on-surface border-b-2 border-light-primary dark:border-dark-primary pb-2 mb-4">{title}</h2>
    <div className="space-y-4 text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
      {children}
    </div>
  </section>
);

const WhitepaperView: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto bg-light-surface-container dark:bg-dark-surface-container p-6 sm:p-10 rounded-2xl border border-light-outline-variant dark:border-dark-outline-variant">
      <header className="text-center mb-12">
        <h1 className="text-headline-lg sm:text-display-sm font-bold text-light-on-surface dark:text-dark-on-surface mb-2">{t.whitepaperTitle}</h1>
        <p className="text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant">Whitepaper v1.0</p>
      </header>
      
      <div className="prose dark:prose-invert max-w-none prose-p:text-body-lg prose-li:text-body-lg prose-p:text-light-on-surface-variant prose-p:dark:text-dark-on-surface-variant prose-li:text-light-on-surface-variant prose-li:dark:text-dark-on-surface-variant prose-strong:text-light-on-surface prose-strong:dark:text-dark-on-surface">
        <Section title="Abstract">
          <p>
            In an era dominated by centralized media and the proliferation of synthetic content, the integrity of information is under constant threat. Censorship, algorithmic manipulation, and surveillance capitalism have eroded public trust and endangered free speech. CLARITY (Censorship-Resistant Ledger for Anonymous Reporting, Integrity, and Truth for You) is a decentralized protocol designed to restore this trust. It provides a secure, immutable, and anonymous platform for verified human journalists and whistleblowers to publish news without fear of censorship, coercion, or AI-driven distortion. By leveraging blockchain technology, decentralized storage, and zero-knowledge proofs, CLARITY creates a self-sovereign, community-governed ecosystem dedicated solely to the preservation and dissemination of verifiable truth.
          </p>
        </Section>

        <Section title="1. Introduction: The Crisis of Information Integrity">
          <p>
            The modern digital landscape is a paradox. While we have unprecedented access to information, its authenticity has never been more questionable. Three primary forces threaten the foundation of a free and informed society:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>Centralized Control:</strong> A handful of corporate and state entities control the primary channels of information distribution. They possess the power to de-platform voices, suppress narratives, and enforce biased content moderation policies that serve their interests, not the public good.</li>
            <li><strong>Surveillance and Monetization:</strong> The dominant business model of the internet is surveillance. Platforms track, profile, and sell user data, creating incentive structures that prioritize engagement over truth. This ad-driven model is fundamentally incompatible with the principles of impartial journalism.</li>
            <li><strong>The Rise of Synthetic Media:</strong> The advent of sophisticated Large Language Models (LLMs) allows for the mass production of synthetic text that is often indistinguishable from human writing. This technology can be weaponized to generate propaganda, misinformation, and spam at a scale that threatens to drown out authentic human voices.</li>
          </ul>
          <p>
            CLARITY is engineered as a direct response to this crisis. It is not another media platform; it is a foundational protocol designed to be technically incapable of censorship, surveillance, and AI manipulation.
          </p>
        </Section>

        <Section title="2. Core Principles: The Foundation of Trust">
           <p>The CLARITY protocol is built on a set of non-negotiable principles, enforced by its architecture:</p>
           <ul className="list-disc space-y-2 pl-5">
            <li><strong>Verifiably Human-Authored Only:</strong> The protocol strictly prohibits the publication of AI-generated or AI-assisted content. Programmatic defenses, including content entropy analysis and cryptographic watermarking, are employed to ensure all published work originates from a human author.</li>
            <li><strong>Absolute Decentralization:</strong> There are no central servers, administrators, or kill switches. All content is stored on the InterPlanetary File System (IPFS), and all state is managed by smart contracts on an Ethereum Layer-2 network.</li>
            <li><strong>User Sovereignty and Privacy:</strong> Authentication is handled exclusively through cryptographic wallets (Sign-In with Ethereum). There are no email signups, no social logins, and no personal data collection. Advanced privacy is offered through optional zero-knowledge (ZK) systems for identity verification and donations.</li>
            <li><strong>Economic Independence:</strong> The platform is a public good, not a for-profit enterprise. It carries no advertisements and has no third-party analytics. Funding is derived solely from voluntary, direct-to-author donations and subscriptions, with a DAO-configurable platform fee that defaults to 0%.</li>
            <li><strong>Transparent and Immutable Governance:</strong> The protocol is governed by the CLARITY DAO. All rules, platform upgrades, and content disputes are resolved through a transparent, on-chain voting process. Every significant action is an immutable event on the blockchain, creating a permanent, public audit trail.</li>
          </ul>
        </Section>
        
        <Section title="6. Conclusion: A New Standard for Digital Journalism">
             <p>The internet stands at a crossroads. We can continue down the path of centralized control and synthetic reality, or we can build new foundations based on decentralization, verifiability, and human integrity. CLARITY represents a decisive step toward the latter. It is more than a tool; it is a statement—a declaration that truth is not a commodity to be bought, sold, or synthesized, but a fundamental public good that must be protected at all costs.</p>
        </Section>

        <div className="text-center mt-12 font-bold text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant space-y-1">
            <p>No ads. No AI. No central control.</p>
            <p>Only truth. Only freedom.</p>
            <p>Only CLARITY.</p>
        </div>
      </div>
    </div>
  );
};

export default WhitepaperView;