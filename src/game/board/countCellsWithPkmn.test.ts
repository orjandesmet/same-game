import { describe, expect, it } from 'vitest';
import { countCellsWithPkmn } from './countCellsWithPkmn';
import { createTestBoard } from './createTestBoard.test-util';

describe('countCellsWithPkmn', () => {
  it('counts the cells in a board that have PKMN in it', () => {
    const board = createTestBoard([
      'R..',
      'RRG',
      'BBG',
    ], [
      '...',
      '.**',
      'M..'
    ]);

    const nrOfCellsWithPkmn = countCellsWithPkmn(board);

    expect(nrOfCellsWithPkmn).toBe(3);
  });

  it('returns 0 when the board is empty', () => {
    const board = createTestBoard([
      'R..',
      'RRG',
      'BBG',
    ], [
      '..*',
      '...',
      '...'
    ]);

    const nrOfCellsWithPkmn = countCellsWithPkmn(board);

    expect(nrOfCellsWithPkmn).toBe(0);
  });
})