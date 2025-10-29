import type { CellColor } from '@game/cells';
import type { Color, PartyMembers, PkmnScore } from './types';
import { COLORS } from './constants';

const PKMN_SCORES: Record<Color, number> = {
  R: 100,
  B: 100,
  Y: 120,
  G: 100,
  P: 150,
  W: 200,
}

export function calculatePkmnScores(pkmnList: CellColor[], party: Partial<PartyMembers>): Array<PkmnScore> {
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
  return COLORS.includes(input.color as Color);
}