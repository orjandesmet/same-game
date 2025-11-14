import { calculateCreatureScores } from './calculateCreatureScores';
import { getEvolutionIdx } from './getEvolutionIdx';

export { COLORS, EMPTY, MEW } from './constants';
export * from './types';
export { BASE_CREATURE_PROBABILITY, CREATURE_NAMES } from './values';

export const creatureUtils = {
  getEvolutionIdx,
  calculateCreatureScores,
}