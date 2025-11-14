import { type PartyMembers, creatureUtils } from './creatures';
import { ALL_CLEARED_BONUS, type ScoreCard } from './types';

export function calculateScore(scoreCard: Partial<ScoreCard> = {}, party: Partial<PartyMembers>, _debug?: DebugFn): number {
  const normalScore = Math.floor((scoreCard.cellsRemoved ?? 0) * (scoreCard.multiplier ?? 1));
  const bonus = scoreCard.allCleared ? ALL_CLEARED_BONUS : 0;
  const creatureScores = creatureUtils.calculateCreatureScores(scoreCard.creatures ?? [], party);
  const totalCreatureScore = creatureScores.reduce((total, {score}) => total + score, 0);
  _debug?.('Calculated score', normalScore + bonus + totalCreatureScore, 'based on', scoreCard);
  return normalScore + bonus + totalCreatureScore;
}
