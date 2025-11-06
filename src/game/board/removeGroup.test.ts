import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { getGroup } from './getGroup';
import { removeGroup } from './removeGroup';

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
      
      const group = getGroup(board, 2, 0, 'R'); // Get the R group
      const updatedBoard = removeGroup(board, group);
      
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
      
      const group = getGroup(board, 2, 0, 'R');
      const updatedBoard = removeGroup(board, group);
      
      // Check that the B column moved left
      expect(updatedBoard).toHaveLength(2);
      updatedBoard[0].forEach(cell => {
        expect(cell.color).toBe('B');
      });
    });
  });
