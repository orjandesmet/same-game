import { COLORS, type CellColor, type Color } from './cells';
import { ALL_CLEARED_BONUS, type ScoreCard } from './types';

export function calculateScore(scoreCard: Partial<ScoreCard> = {}, debug?: (...args: unknown[]) => void): number {
  const normalScore = Math.floor((scoreCard.cellsRemoved ?? 0) * (scoreCard.multiplier ?? 1));
  const bonus = scoreCard.allCleared ? ALL_CLEARED_BONUS : 0;
  const pkmnScores = calculatePkmnScores(scoreCard.pkmn ?? []);
  const totalPkmnScore = pkmnScores.reduce((total, {score}) => total + score, 0);
  debug?.('Calculated score', normalScore + bonus + totalPkmnScore, 'based on', scoreCard);
  return normalScore + bonus + totalPkmnScore;
}

const PKMN_SCORES: Record<Color, number> = {
  R: 100,
  B: 100,
  Y: 120,
  G: 100,
  P: 150,
  W: 200,
}

type PkmnScore = {color: Color, score: number};

export function calculatePkmnScores(pkmnList: CellColor[]): Array<PkmnScore> {
  return Object.entries(PKMN_SCORES)
    .map(([color, score]) => ({color, score}))
    .filter(isValidPkmnScore)
    .map(({color, score}) => ({
      color,
      baseScore: score,
      score: pkmnList.filter((pkmn) => pkmn === color).length * score
    }))
    .filter(({score}) => score !== 0);
}

function isValidPkmnScore(input: {color: string, score: number}): input is PkmnScore {
  return COLORS.includes(input.color as Color);
}
