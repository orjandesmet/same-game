import type { CellColor } from '@game/cells';
import { COLORS, MEW } from './constants';
import type { Color, ExtendedColor, PartyMembers, PkmnScore } from './types';

const PKMN_SCORES: Record<ExtendedColor, number> = {
  R: 100,
  B: 100,
  Y: 120,
  G: 100,
  P: 150,
  W: 200,
  M: 500,
}

export function calculatePkmnScores(pkmnList: (CellColor | typeof MEW)[], party: Partial<PartyMembers>): Array<PkmnScore> {
  return Object.entries(PKMN_SCORES)
    .map(([color, score]) => ({color, score}))
    .filter(isValidPkmnScore)
    .map(({color, score}) => ({
      color,
      level: party[color] ?? 1,
      baseScore: score,
      score: pkmnList.filter((pkmn) => pkmn === color).length * score
    }))
    .filter(({score}) => score !== 0);
}

function isValidPkmnScore(input: {color: string, score: number}): input is PkmnScore {
  return COLORS.includes(input.color as Color) || input.color === MEW;
}