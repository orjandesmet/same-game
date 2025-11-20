import { cellUtils } from '@game/cells';
import { flattenBoard } from './flattenBoard';
import type { Board } from './types';

export function countCellsWithCreature(board: Board): Readonly<number> {
  return flattenBoard(board).filter(cellUtils.hasCreature).length;
}
