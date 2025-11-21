import type { CellColor } from '@game/cells';
import { COLORS, SPECIAL_CREATURE } from './constants';
import type {
  Color,
  CreatureScore,
  ExtendedColor,
  PartyMembers,
} from './types';

const CREATURE_SCORES: Record<ExtendedColor, number> = {
  R: 100,
  B: 100,
  Y: 120,
  G: 100,
  P: 150,
  W: 200,
  M: 500,
};

export function calculateCreatureScores(
  creatureList: (CellColor | typeof SPECIAL_CREATURE)[],
  party: Partial<PartyMembers>
): Array<CreatureScore> {
  return Object.entries(CREATURE_SCORES)
    .map(([color, score]) => ({ color, score }))
    .filter(isValidCreatureScore)
    .map(({ color, score }) => ({
      color,
      level: party[color] ?? 1,
      baseScore: score,
      score: creatureList.filter((creature) => creature === color).length * score,
    }))
    .filter(({ score }) => score !== 0);
}

function isValidCreatureScore(input: {
  color: string;
  score: number;
}): input is CreatureScore {
  return (
    COLORS.includes(input.color as Color) || input.color === SPECIAL_CREATURE
  );
}
