
import React, { useState } from 'react';
import { Proposal, SiweSession } from '../types';
import ProposalCard from './ProposalCard';
import { useI18n } from '../contexts/I18nContext';

interface GovernanceViewProps {
  proposals: Proposal[];
  session: SiweSession | null;
  onVote: (proposalId: number, vote: 'for' | 'against') => Promise<void>;
  onCreateProposal: (title: string, description: string) => Promise<void>;
}

const GovernanceView: React.FC<GovernanceViewProps> = ({ proposals, session, onVote, onCreateProposal }) => {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    await onCreateProposal(title, description);
    setIsCreating(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h1 className="text-headline-lg font-bold text-light-on-surface dark:text-dark-on-surface mb-2">{t.governanceTitle}</h1>
      <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant mb-8">
        {t.governanceDesc}
      </p>

      {session && (
        <div className="bg-light-surface-container dark:bg-dark-surface-container rounded-2xl p-6 sm:p-8 border border-light-outline-variant dark:border-dark-outline-variant mb-8">
          <h2 className="text-headline-md font-semibold text-light-on-surface dark:text-dark-on-surface mb-4">Create Proposal</h2>
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Proposal title" className="w-full h-12 px-4 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-light-outline dark:border-dark-outline text-body-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your proposal..." rows={4} className="w-full p-4 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-light-outline dark:border-dark-outline text-body-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"/>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={!title.trim() || !description.trim() || isCreating} className="h-10 px-6 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-label-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg">
                {isCreating ? 'Creating...' : 'Create Proposal'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {proposals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {proposals.map(proposal => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              session={session}
              onVote={onVote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.noProposalsFound}</p>
        </div>
      )}
    </div>
  );
};

export default GovernanceView;