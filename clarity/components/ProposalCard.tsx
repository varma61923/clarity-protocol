
import React, { useState } from 'react';
import { Proposal, ProposalStatus, SiweSession } from '../types';
import Spinner from './Spinner';
import { useI18n } from '../contexts/I18nContext';

interface ProposalCardProps {
  proposal: Proposal;
  session: SiweSession | null;
  onVote: (proposalId: number, vote: 'for' | 'against') => Promise<void>;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, session, onVote }) => {
  const { t, locale } = useI18n();
  const [isVoting, setIsVoting] = useState<'for' | 'against' | null>(null);

  const statusStyles: { [key in ProposalStatus]: { bg: string; text: string; label: string } } = {
    active: { bg: 'bg-light-primary-container', text: 'text-light-on-primary-container', label: t.status.active },
    passed: { bg: 'bg-accent-green/20', text: 'text-accent-green', label: t.status.passed },
    failed: { bg: 'bg-light-error-container', text: 'text-light-on-error-container', label: t.status.failed },
    executed: { bg: 'bg-light-surface-variant', text: 'text-light-on-surface-variant', label: t.status.executed },
    closed: { bg: 'bg-light-surface-variant', text: 'text-light-on-surface-variant', label: t.status.closed },
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const { bg, text, label } = statusStyles[proposal.status];
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  const formattedEndDate = new Date(proposal.endDate).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });

  const handleVote = async (vote: 'for' | 'against') => {
    if (proposal.userVote) return;
    setIsVoting(vote);
    await onVote(proposal.id, vote);
    setIsVoting(null);
  };

  const hasVoted = !!proposal.userVote;
  const canVote = proposal.status === 'active' && !!session;

  const VoteButton: React.FC<{ voteType: 'for' | 'against' }> = ({ voteType }) => (
    <button
      onClick={() => handleVote(voteType)}
      disabled={isVoting !== null}
      className={`w-full h-12 rounded-full text-title-md font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        voteType === 'for' 
        ? 'text-accent-green hover:bg-accent-green/10' 
        : 'text-light-error dark:text-dark-error hover:bg-light-error-container/50 dark:hover:bg-dark-error-container/50'
      }`}
    >
      {isVoting === voteType ? <Spinner /> : (voteType === 'for' ? t.voteFor : t.voteAgainst)}
    </button>
  );

  return (
    <div className="bg-light-surface-container dark:bg-dark-surface-container-high rounded-2xl shadow-sm border border-light-outline-variant dark:border-dark-outline-variant/50 flex flex-col">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <p className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-wider font-semibold">{proposal.type}</p>
          <div className={`px-3 py-1 text-label-sm font-bold rounded-full ${bg} ${text} flex-shrink-0`}>
            {label}
          </div>
        </div>
        
        <h3 className="text-headline-sm font-semibold text-light-on-surface dark:text-dark-on-surface mt-1 mb-3">{proposal.title}</h3>
        <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant mb-6 flex-grow">{proposal.description}</p>
        
        <div className="space-y-2">
            <div className="w-full bg-light-surface-container-highest dark:bg-dark-surface-container-highest rounded-full h-2.5">
                <div 
                    className="h-2.5 rounded-full transition-all duration-500 bg-accent-green"
                    style={{ width: `${forPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={forPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
             <div className="flex justify-between text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant font-mono">
                <span>{t.votes.against.replace('{count}', formatNumber(proposal.votesAgainst))}</span>
                <span>{t.votes.for.replace('{count}', formatNumber(proposal.votesFor))}</span>
            </div>
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-light-outline-variant dark:border-dark-outline-variant/50">
          {canVote ? (
              hasVoted ? (
                  <div className="text-center text-title-md font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      <span>{t.youVoted.replace('{vote}', proposal.userVote!)}</span>
                  </div>
              ) : (
                <div className="flex items-center gap-4">
                    <VoteButton voteType="against" />
                    <div className="w-px h-6 bg-light-outline-variant dark:border-dark-outline-variant/50"></div>
                    <VoteButton voteType="for" />
                </div>
              )
          ) : (
              <div className="text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant text-center font-semibold">
                  {proposal.status === 'active' ? t.connectToVote : t.votingEnded.replace('{date}', formattedEndDate)}
              </div>
          )}
      </div>
    </div>
  );
};

export default ProposalCard;
