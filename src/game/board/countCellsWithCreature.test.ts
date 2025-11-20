import { describe, expect, it } from 'vitest';
import { countCellsWithCreature } from './countCellsWithCreature';
import { createTestBoard } from './createTestBoard.test-util';

describe('countCellsWithCreature', () => {
  it('counts the cells in a board that have a creature in it', () => {
    const board = createTestBoard(['R..', 'RRG', 'BBG'], ['...', '.**', 'M..']);

    const nrOfCellsWithCreature = countCellsWithCreature(board);

    expect(nrOfCellsWithCreature).toBe(3);
  });

  it('returns 0 when the board is empty', () => {
    const board = createTestBoard(['R..', 'RRG', 'BBG'], ['..*', '...', '...']);

    const nrOfCellsWithCreature = countCellsWithCreature(board);

    expect(nrOfCellsWithCreature).toBe(0);
  });
});
