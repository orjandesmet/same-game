import { EMPTY, type Color } from '@game/pkmn';
import type { Board } from './types';

export function createTestBoard(pattern: string[]): Board {
  return pattern[0].split('').map((_, columnIdx) => 
    pattern.map((row) => ({
      key: `${row.length - 1 - pattern.indexOf(row)}:${columnIdx}`,
      color: row[columnIdx] === '.' ? EMPTY : (row[columnIdx] as Color),
      hasPkmn: false,
      hasM: false,
      level: 1,
      cellState: 'NORMAL' as const
    }))
  ) as Board;
}