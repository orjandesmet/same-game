import { clamp } from '@utils/clamp';
import type { Color } from './types';
import { EVOLUTION_LEVELS } from './values';

export function getEvolutionIdx(color: Color, level: number): number {
  const lvlToCheck = clamp(1, level, 100);
  const evolutionLevels = EVOLUTION_LEVELS[color] || [0];
  return evolutionLevels.findLastIndex((evLvl) => evLvl <= lvlToCheck)!; // There will always be a 0
}
