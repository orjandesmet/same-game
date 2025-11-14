import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { flattenBoard } from './flattenBoard';
import { EMPTY } from '@game/creatures';

describe('flattenBoard', () => {
  const board = createTestBoard(['.GB', 'RBB', 'BGG'], ['..*', '*..', '.M.']);

  it('returns a flat representation of the board', () => {
    const flatBoard = flattenBoard(board);

    expect(flatBoard).toHaveLength(9);

    expect(flatBoard.at(0)).toStrictEqual({
      key: '0:0',
      rowIdx: 0,
      columnIdx: 0,
      color: EMPTY,
      hasCreature: false,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(1)).toStrictEqual({
      key: '1:0',
      rowIdx: 1,
      columnIdx: 0,
      color: 'R',
      hasCreature: true,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(2)).toStrictEqual({
      key: '2:0',
      rowIdx: 2,
      columnIdx: 0,
      color: 'B',
      hasCreature: false,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(3)).toStrictEqual({
      key: '0:1',
      rowIdx: 0,
      columnIdx: 1,
      color: 'G',
      hasCreature: false,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(4)).toStrictEqual({
      key: '1:1',
      rowIdx: 1,
      columnIdx: 1,
      color: 'B',
      hasCreature: false,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(5)).toStrictEqual({
      key: '2:1',
      rowIdx: 2,
      columnIdx: 1,
      color: 'G',
      hasCreature: true,
      hasM: true,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(6)).toStrictEqual({
      key: '0:2',
      rowIdx: 0,
      columnIdx: 2,
      color: 'B',
      hasCreature: true,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(7)).toStrictEqual({
      key: '1:2',
      rowIdx: 1,
      columnIdx: 2,
      color: 'B',
      hasCreature: false,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
    expect(flatBoard.at(8)).toStrictEqual({
      key: '2:2',
      rowIdx: 2,
      columnIdx: 2,
      color: 'G',
      hasCreature: false,
      hasM: false,
      level: 1,
      cellState: 'NORMAL',
    });
  });
});
