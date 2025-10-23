import { EMPTY, type Cell } from './types';

export function isEmptyCell(cell: Cell): Readonly<boolean> {
  return cell.color === EMPTY;
}