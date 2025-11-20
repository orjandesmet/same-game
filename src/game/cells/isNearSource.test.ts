import { describe, expect, it } from 'vitest';
import { isNearSource } from './isNearSource';

describe('isNearSource', () => {
  it.each([
    [1, 5, 2],
    [2, 5, 2],
    [4, 5, 2],
    [5, 5, 2],
    [3, 3, 2],
    [3, 4, 2],
    [3, 6, 2],
    [3, 7, 2],
    [2, 4, 2],
    [4, 4, 2],
    [2, 6, 2],
    [4, 6, 2],
    [3, 5, 2],
    [0, 5, 3],
    [1, 4, 3],
    [2, 4, 3],
  ])(
    'should return true for cell %s:%s is within a radius of %s of the source 3:5',
    (rowIdx, columnIdx, radius) => {
      const sourceRowIdx = 3;
      const sourceColumnIdx = 5;

      expect(
        isNearSource(rowIdx, columnIdx, sourceRowIdx, sourceColumnIdx, radius)
      ).toBe(true);
    }
  );

  it.each([
    [0, 5, 2],
    [7, 3, 2],
    [10, 10, 2],
  ])(
    'should return false for cell %s:%s beyond the radius of %s of the source 3:5',
    (rowIdx, columnIdx, radius) => {
      const sourceRowIdx = 3;
      const sourceColumnIdx = 5;

      expect(
        isNearSource(rowIdx, columnIdx, sourceRowIdx, sourceColumnIdx, radius)
      ).toBe(false);
    }
  );
});
