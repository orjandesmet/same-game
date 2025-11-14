import { isEmptyCell } from './isEmptyCell';
import type { Cell } from './types';

export function hasCreature(cell: Cell) {
  return !isEmptyCell(cell) && cell.hasCreature;
}
