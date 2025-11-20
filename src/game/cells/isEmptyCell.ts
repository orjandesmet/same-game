import { EMPTY } from '@game/creatures';
import { type Cell } from './types';

export function isEmptyCell(cell: Cell): Readonly<boolean> {
  return cell.color === EMPTY;
}
