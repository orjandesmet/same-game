import { EMPTY } from '@game/creatures';
import { describe, expect, it } from 'vitest';
import { isEmptyCell } from './isEmptyCell';
import type { Cell } from './types';

describe('isEmptyCell', () => {
  it('should return true when the cell is empty', () => {
    const cell: Cell = {
      cellState: 'NORMAL',
      color: EMPTY,
      hasCreature: true,
      hasSpecialCreature: false,
      key: '1:2',
      level: 30,
    };

    expect(isEmptyCell(cell)).toBe(true);
  });

  it('should return false when the cell has a color but no creature', () => {
    const cell: Cell = {
      cellState: 'NORMAL',
      color: 'B',
      hasCreature: false,
      hasSpecialCreature: false,
      key: '1:2',
      level: 30,
    };

    expect(isEmptyCell(cell)).toBe(false);
  });
});
