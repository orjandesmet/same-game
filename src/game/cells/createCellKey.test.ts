import { describe, expect, it } from 'vitest';
import { createCellKey } from './createCellKey';

describe('createCellKey', () => {
  it('should create a cell key with row and column index', () => {
    const rowIdx = 1;
    const columnIdx = 6;

    expect(createCellKey(rowIdx, columnIdx)).toBe('1:6');
  });
});
