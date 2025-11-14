import type { Board } from '@game/board';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBurningGroup } from './getBurningGroup';
import { EMPTY } from '@game/creatures';
import { cellUtils } from '../cells';

describe('getBurningGroup', () => {
  const mockIsNearSource = vi.spyOn(cellUtils, 'isNearSource');
  beforeEach(() => {
    mockIsNearSource.mockClear();
  });

  it('should return a group of cells that a radius of 2 away from the selected cell when the cell has no special creature', () => {
    const board: Board = [[
      {cellState: 'NORMAL', color: 'R', hasCreature: true, hasSpecialCreature: false, key: '0:0', level: 32},
      {cellState: 'NORMAL', color: 'R', hasCreature: true, hasSpecialCreature: false, key: '1:0', level: 32}
    ]];

    getBurningGroup(false)(board, {rowIdx: 0, columnIdx: 0}, () => {});
    expect(mockIsNearSource).toHaveBeenCalledTimes(2);
    expect(mockIsNearSource).toHaveBeenCalledWith(0, 0, 0, 0, 2);
    expect(mockIsNearSource).toHaveBeenCalledWith(1, 0, 0, 0, 2);
  });

  it('should ignore empty cells', () => {
    const board: Board = [[
      {cellState: 'NORMAL', color: 'R', hasCreature: true, hasSpecialCreature: false, key: '0:0', level: 32},
      {cellState: 'NORMAL', color: EMPTY, hasCreature: true, hasSpecialCreature: false, key: '1:0', level: 32}
    ]];

    getBurningGroup(false)(board, {rowIdx: 0, columnIdx: 0}, () => {});
    expect(mockIsNearSource).toHaveBeenCalledTimes(1);
    expect(mockIsNearSource).toHaveBeenCalledWith(0, 0, 0, 0, 2);
  });

  it('should return a group of cells that a radius of 4 away from the selected cell when the cell has a special creature', () => {
    const board: Board = [[
      {cellState: 'NORMAL', color: 'R', hasCreature: true, hasSpecialCreature: false, key: '0:0', level: 32},
      {cellState: 'NORMAL', color: 'R', hasCreature: true, hasSpecialCreature: false, key: '1:0', level: 32}
    ]];

    getBurningGroup(true)(board, {rowIdx: 0, columnIdx: 0}, () => {});
    expect(mockIsNearSource).toHaveBeenCalledTimes(2);
    expect(mockIsNearSource).toHaveBeenCalledWith(0, 0, 0, 0, 4);
    expect(mockIsNearSource).toHaveBeenCalledWith(1, 0, 0, 0, 4);
  });
});