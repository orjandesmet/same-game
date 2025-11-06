import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { isEmptyColumn } from './isEmptyColumn';

describe('isEmptyColumn', () => {
  const board = createTestBoard([
    '.R.',
    'RB.',
    'RG.',
  ]);

  it.each([0, 1])('should return false for cell columnIdx', (columnIdx) => {
    expect(isEmptyColumn(board[columnIdx])).toBe(false);
  });

  it('should return true for cell columnIdx 2', () => {
    expect(isEmptyColumn(board[2])).toBe(true);
  });
});