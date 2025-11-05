import { describe, expect, it } from 'vitest';
import { boardUtils } from '.';
import type { Board } from './types';
import { COLORS, EMPTY } from '@game/pkmn';
import type { Color, PartyMembers } from '@game/pkmn';
import { PlainRNG } from '@game/rng';

describe('boardUtils', () => {
  describe('createBoard', () => {
    it('creates a board with specified dimensions', () => {
      const rows = 3;
      const columns = 4;
      const party: Partial<PartyMembers> = { R: 1, B: 1 };
      const rng = new PlainRNG();
      
      const board = boardUtils.createBoard(rows, columns, party, rng);
      
      expect(board).toHaveLength(columns);
      board.forEach(column => {
        expect(column).toHaveLength(rows);
      });
    });

    it('creates cells with valid properties', () => {
      const party: Partial<PartyMembers> = { R: 2, B: 1 };
      const rng = new PlainRNG();
      
      const board = boardUtils.createBoard(2, 2, party, rng);
      
      board.forEach((column, columnIdx) => {
        column.forEach((cell, rowIdx) => {
          expect(cell).toMatchObject({
            key: `${rowIdx}:${columnIdx}`,
            cellState: 'NORMAL',
            hasM: false
          });
          expect(['R', 'B']).toContain(cell.color);
          if (cell.color === 'R') {
            expect(cell.level).toBe(2);
          } else {
            expect(cell.level).toBe(1);
          }
        });
      });
    });
  });

  describe('getGroup', () => {
    const createTestBoard = (pattern: string[]): Board => {
      return pattern[0].split('').map((_, columnIdx) => 
        pattern.map((row) => ({
          key: `${row.length - 1 - pattern.indexOf(row)}:${columnIdx}`,
          color: row[columnIdx] === '.' ? EMPTY : row[columnIdx],
          hasPkmn: false,
          hasM: false,
          level: 1,
          cellState: 'NORMAL'
        }))
      );
    };

    it('finds connected cells of the same color', () => {
      // R R .
      // R B .
      // . B .
      const board = createTestBoard([
        '...', 
        'RB.', 
        'RB.'
      ]);
      
      const group = boardUtils.getGroup(board, 1, 0, 'R');
      
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
      
      const group = boardUtils.getGroup(board, 1, 1, 'R');
      
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
      
      const group = boardUtils.getGroup(board, 1, 0, 'R');
      
      expect(group).toHaveLength(3);
    });

    it('stops at different colors', () => {
      // R B R
      // R R R
      const board = createTestBoard([
        'RRR',
        'RBR'
      ]);
      
      const group = boardUtils.getGroup(board, 1, 0, 'R');
      
      expect(group).toHaveLength(5);
      expect(group).not.toContain('1:1'); // Center B
    });
  });

  describe('removeGroup', () => {
    it('removes specified group and applies gravity', () => {
      // R R .    . . .
      // B R . -> B . .
      // R B .    R R .
      const board = createTestBoard([
        '...',
        'BR.',
        'RB.'
      ]);
      
      const group = boardUtils.getGroup(board, 2, 0, 'R'); // Get the R group
      const updatedBoard = boardUtils.removeGroup(board, group);
      
      // Check that Rs were removed and remaining pieces fell down
      expect(updatedBoard[0][0].color).toBe('B');
      expect(updatedBoard[0][1].color).toBe('R');
      expect(updatedBoard[1][0].color).toBe('B');
    });

    it('moves columns to the left when empty', () => {
      // R B .    B .
      // R B . -> B .
      // R B .    B .
      const board = createTestBoard([
        '...',
        'BBB',
        'RRR'
      ]);
      
      const group = boardUtils.getGroup(board, 2, 0, 'R');
      const updatedBoard = boardUtils.removeGroup(board, group);
      
      // Check that the B column moved left
      expect(updatedBoard).toHaveLength(2);
      updatedBoard[0].forEach(cell => {
        expect(cell.color).toBe('B');
      });
    });
  });

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
      
      const groups = boardUtils.getAllGroups(board);
      
      // Should find one large R group and one B group
      expect(groups).toHaveLength(2);
      
      const rGroup = groups.find(g => board[parseInt(g[0].split(':')[1])][parseInt(g[0].split(':')[0])].color === 'R');
      const bGroup = groups.find(g => board[parseInt(g[0].split(':')[1])][parseInt(g[0].split(':')[0])].color === 'B');
      
      expect(rGroup).toHaveLength(5); // Connected R cells
      expect(bGroup).toHaveLength(3); // Connected B cells
    });

    it('returns empty array for empty board', () => {
      const board = createTestBoard([]);
      const groups = boardUtils.getAllGroups(board);
      expect(groups).toEqual([]);
    });
  });
});

// Helper function to create a test board from a string pattern
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