import type { CellKey } from './types';

export function createCellKey(rowIdx: number, columnIdx: number): CellKey {
  return `${rowIdx}:${columnIdx}`;
}