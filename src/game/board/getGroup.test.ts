import { EMPTY, type Color } from '@game/pkmn';
import { describe, expect, it } from 'vitest';
import type { Board } from './types';
import { getGroup } from './getGroup';

describe('getGroup', () => {

    it('finds connected cells of the same color', () => {
      // R R .
      // R B .
      // . B .
      const board = createTestBoard([
        '...', 
        'RB.', 
        'RB.'
      ]);
      
      const group = getGroup(board, 1, 0, 'R');
      
      expect(group).toHaveLength(2);
      expect(group).toContain('1:0'); // Middle R
      expect(group).toContain('2:0'); // Bottom R
    });

    it('finds all connected cells in complex patterns', () => {
      // R R B
      // B R B
      // B R R
      const board = createTestBoard([
        'BRR',
        'BRB',
        'RRB'
      ]);
      
      const group = getGroup(board, 1, 1, 'R');
      
      expect(group).toHaveLength(5);
      expect(group).toContain('1:1'); // Center R
      expect(group).toContain('2:1'); // Top R
      expect(group).toContain('2:2'); // Top right R
      expect(group).toContain('0:1'); // Bottom R
      expect(group).toContain('0:2'); // Bottom right R
    });

    it('stops at board boundaries', () => {
      // R R
      // R .
      const board = createTestBoard([
        '.',
        'RR'
      ]);
      
      const group = getGroup(board, 1, 0, 'R');
      
      expect(group).toHaveLength(3);
    });

    it('stops at different colors', () => {
      // R B R
      // R R R
      const board = createTestBoard([
        'RRR',
        'RBR'
      ]);
      
      const group = getGroup(board, 1, 0, 'R');
      
      expect(group).toHaveLength(5);
      expect(group).not.toContain('1:1'); // Center B
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