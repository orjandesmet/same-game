import type { CellColor } from '@game/cells';
import { COLORS, MEW } from './constants';
import type { Color, ExtendedColor, PartyMembers, CreatureScore } from './types';

const CREATURE_SCORES: Record<ExtendedColor, number> = {
  R: 100,
  B: 100,
  Y: 120,
  G: 100,
  P: 150,
  W: 200,
  M: 500,
}

export function calculateCreatureScores(pkmnList: (CellColor | typeof MEW)[], party: Partial<PartyMembers>): Array<CreatureScore> {
  return Object.entries(CREATURE_SCORES)
    .map(([color, score]) => ({color, score}))
    .filter(isValidCreatureScore)
    .map(({color, score}) => ({
      color,
      level: party[color] ?? 1,
      baseScore: score,
      score: pkmnList.filter((pkmn) => pkmn === color).length * score
    }))
    .filter(({score}) => score !== 0);
}

function isValidCreatureScore(input: {color: string, score: number}): input is CreatureScore {
  return COLORS.includes(input.color as Color) || input.color === MEW;
}