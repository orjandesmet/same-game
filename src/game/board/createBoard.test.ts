import { describe, expect, it } from 'vitest';

import type { PartyMembers } from '@game/pkmn';
import { Xorshift32 } from '@game/rng/xorshift32';
import { createBoard } from './createBoard';

describe('createBoard', () => {
    it('creates a board with specified dimensions', () => {
      const rows = 3;
      const columns = 4;
      const party: Partial<PartyMembers> = { R: 1, B: 1 };
      const rng = new Xorshift32();
      
      const board = createBoard(rows, columns, party, rng);
      
      expect(board).toHaveLength(columns);
      board.forEach(column => {
        expect(column).toHaveLength(rows);
      });
    });

    it('creates cells with valid properties', () => {
      const party: Partial<PartyMembers> = { R: 2, B: 1 };
      const rng = new Xorshift32();
      
      const board = createBoard(2, 2, party, rng);
      
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