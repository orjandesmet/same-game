import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { updateCellsInBoard } from './updateCellsInBoard';
import { type CellKey } from '@game/cells';

describe('updateCellsInBoard', () => {
  const board = createTestBoard([
    '.GB',
    'RBB',
    'BGG',
  ], [
    '..*',
    '*..',
    '.M.',
  ]);
  const group: CellKey[] = ['0:2', '1:1', '1:2'];
  const newBoard = updateCellsInBoard(board, group, {cellState: 'BURNING'});

  it.each([
    [0, 0, 'NORMAL'],
    [0, 1, 'NORMAL'],
    [0, 2, 'BURNING'],
    [1, 0, 'NORMAL'],
    [1, 1, 'BURNING'],
    [1, 2, 'BURNING'],
    [2, 0, 'NORMAL'],
    [2, 1, 'NORMAL'],
    [2, 2, 'NORMAL'],
  ])('cell with key %s:%s should have state %s', (rowIdx, columnIdx, state) => {
    expect(newBoard[columnIdx][rowIdx].cellState).toBe(state);
    
    // Original board should stay unchanged
    expect(board[columnIdx][rowIdx].cellState).toBe('NORMAL');
  });
});