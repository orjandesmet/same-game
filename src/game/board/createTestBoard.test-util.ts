import { EMPTY, type Color } from '@game/creatures';
import type { Board } from './types';

export function createTestBoard(
  pattern: string[],
  creatures?: string[],
  keys?: string[]
): Board {
  if (pattern.length === 0) {
    return [];
  }
  return pattern[0].split('').map((_, columnIdx) =>
    pattern.map((row, rowIdx) => ({
      key: keys ? keys[rowIdx][columnIdx] : `${rowIdx}:${columnIdx}`,
      color: row[columnIdx] === '.' ? EMPTY : (row[columnIdx] as Color),
      hasCreature: !!creatures && !!creatures[rowIdx]?.[columnIdx] && creatures[rowIdx]?.[columnIdx] !== '.',
      hasSpecialCreature: !!creatures && creatures[rowIdx]?.[columnIdx] === 'M',
      level: 1,
      cellState: 'NORMAL' as const,
    }))
  ) as Board;
}
