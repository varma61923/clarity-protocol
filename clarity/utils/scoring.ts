
import { Article } from '../types';

export const calculateImpactScore = (article: Article): number => {
  // Formula based on verifications, author reputation, and total donations
  const verificationScore = article.verifications * 1.5;
  const reputationScore = article.author.reputationScore / 10;
  const donationScore = (article.author.totalDonations || 0) / 20;

  // The score is rounded to the nearest integer
  return Math.round(verificationScore + reputationScore + donationScore);
};
