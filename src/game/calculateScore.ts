import { type PartyMembers, pkmnUtils } from './pkmn';
import { ALL_CLEARED_BONUS, type ScoreCard } from './types';

export function calculateScore(scoreCard: Partial<ScoreCard> = {}, party: Partial<PartyMembers>, debug?: (...args: unknown[]) => void): number {
  const normalScore = Math.floor((scoreCard.cellsRemoved ?? 0) * (scoreCard.multiplier ?? 1));
  const bonus = scoreCard.allCleared ? ALL_CLEARED_BONUS : 0;
  const pkmnScores = pkmnUtils.calculatePkmnScores(scoreCard.pkmn ?? [], party);
  const totalPkmnScore = pkmnScores.reduce((total, {score}) => total + score, 0);
  debug?.('Calculated score', normalScore + bonus + totalPkmnScore, 'based on', scoreCard);
  return normalScore + bonus + totalPkmnScore;
}
