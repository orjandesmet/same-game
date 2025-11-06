import { cellUtils, type CellColor, type CellKey } from '@game/cells';
import type { Board } from './types';

export function getAllCellsWithColors(
  board: Board,
  colors: CellColor[]
): CellKey[] {
  return board
    .flatMap((column, columnIdx) =>
      column.map((cell, rowIdx) => {
        if (cellUtils.isEmptyCell(cell) || !colors.includes(cell.color)) {
          return null;
        }
        return cellUtils.createCellKey(rowIdx, columnIdx);
      })
    )
    .filter((cellKey): cellKey is CellKey => cellKey !== null);
}
