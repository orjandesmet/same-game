import type { ColumnIdx, RowIdx } from './types';

export function isNearSource(
  rowIdx: RowIdx,
  columnIdx: ColumnIdx,
  sourceRowIdx: RowIdx,
  sourceColumnIdx: ColumnIdx,
  distance: Readonly<number>
): Readonly<boolean> {
  const calculatedDistance = Math.sqrt(
    Math.pow(rowIdx - sourceRowIdx, 2) +
      Math.pow(columnIdx - sourceColumnIdx, 2)
  );
  return calculatedDistance <= distance;
}
