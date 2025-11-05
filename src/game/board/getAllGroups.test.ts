import { describe, expect, it } from 'vitest';
import { getAllGroups } from './getAllGroups';
import { EMPTY, type Color } from '@game/pkmn';
import type { Board } from './types';

describe('getAllGroups', () => {
    it('finds all possible groups on the board', () => {
      // R R B
      // B R B
      // B R R
      const board = createTestBoard([
        'BRR',
        'BRB',
        'RRB'
      ]);
      
      const groups = getAllGroups(board);
      
      // Should find one large R group and one B group
      expect(groups).toHaveLength(2);
      
      const rGroup = groups.find(g => board[parseInt(g[0].split(':')[1])][parseInt(g[0].split(':')[0])].color === 'R');
      const bGroup = groups.find(g => board[parseInt(g[0].split(':')[1])][parseInt(g[0].split(':')[0])].color === 'B');
      
      expect(rGroup).toHaveLength(5); // Connected R cells
      expect(bGroup).toHaveLength(3); // Connected B cells
    });

    it('returns empty array for empty board', () => {
      const board = createTestBoard([]);
      const groups = getAllGroups(board);
      expect(groups).toEqual([]);
    });
  });

  function createTestBoard(pattern: string[]): Board {
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