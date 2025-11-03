import { cellUtils, type CellKey } from '@game/cells';
import { flattenBoard } from './flattenBoard';
import type { Board } from './types';

export function getNonEmptyCells(board: Board): CellKey[] {
  return flattenBoard(board).filter((cell) => !cellUtils.isEmptyCell(cell)).map(({rowIdx, columnIdx}) => cellUtils.createCellKey(rowIdx, columnIdx));
}