import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { getNonEmptyCells } from './getNonEmptyCells';

describe('getNonEmptyCells', () => {
  const board = createTestBoard([
    '..R',
    'RBG',
    'RGR',
  ]);

  it('should get all cell positions with a given color', () => {

    const nonEmptyCells = getNonEmptyCells(board);

    expect(nonEmptyCells).toHaveLength(7);
    expect(nonEmptyCells).toContain('1:1');

    expect(nonEmptyCells).toContain('1:2');
    expect(nonEmptyCells).toContain('2:1');
    
    expect(nonEmptyCells).toContain('0:2');
    expect(nonEmptyCells).toContain('1:0');
    expect(nonEmptyCells).toContain('2:0');
    expect(nonEmptyCells).toContain('2:2');
  });
});