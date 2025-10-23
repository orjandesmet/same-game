import { flattenBoard } from './flattenBoard';
import type { Board } from './types';

export function countCellsWithPkmn(board: Board): Readonly<number> {
  return flattenBoard(board).filter((cell) => cell.hasPkmn).length;
}