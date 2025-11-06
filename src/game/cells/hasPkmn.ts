import { isEmptyCell } from './isEmptyCell';
import type { Cell } from './types';

export function hasPkmn(cell: Cell) {
  return !isEmptyCell(cell) && cell.hasPkmn;
}
