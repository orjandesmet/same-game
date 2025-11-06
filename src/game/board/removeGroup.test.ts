import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { removeGroup } from './removeGroup';
import type { CellKey } from '@game/cells';

describe('removeGroup', () => {
  const board = createTestBoard(
    ['BBR', 'RBG', 'RGR'],
    [],
    ['123', '456', '789']
  );

  it('removes specified group and applies gravity', () => {
    const expectedBoard = createTestBoard(
      ['.BR', '.BG', 'BGR'],
      [],
      ['423', '756', '189']
    );

    const group: CellKey[] = ['1:0', '2:0'];
    const updatedBoard = removeGroup(board, group);

    expect(updatedBoard).toEqual(expectedBoard);
  });

  it('moves columns to the left when empty', () => {
    const expectedBoard = createTestBoard(
      ['BR.', 'RG.', 'RR.'],
      [],
      ['132', '465', '798']
    );

    const group: CellKey[] = ['0:1', '1:1', '2:1'];
    const updatedBoard = removeGroup(board, group);

    expect(updatedBoard).toEqual(expectedBoard);
  });
});
