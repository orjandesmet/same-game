import { EMPTY, type Color } from '@game/pkmn';
import type { Board } from './types';

export function createTestBoard(pattern: string[], pkmn: string[] = []): Board {
  if (pattern.length === 0) {
    return [];
  }
  return pattern[0].split('').map((_, columnIdx) => 
    pattern.map((row, rowIdx) => ({
      key: `${rowIdx}:${columnIdx}`,
      color: row[columnIdx] === '.' ? EMPTY : (row[columnIdx] as Color),
      hasPkmn: pkmn[rowIdx]?.[columnIdx] && pkmn[rowIdx]?.[columnIdx] !== '.',
      hasM: pkmn[rowIdx]?.[columnIdx] === 'M',
      level: 1,
      cellState: 'NORMAL' as const
    }))
  ) as Board;
}