import { cellUtils, type CellKey } from '../cells';
import type { EffectGroupFn } from './types';

export const getShockedGroup: EffectGroupFn = (
  board,
  { rowIdx: sourceRowIdx, columnIdx: sourceColumnIdx }
) => {
  const sourceColor = board[sourceColumnIdx][sourceRowIdx].color;
  return board
    .flatMap((column, columnIdx) =>
      column.map((cell, rowIdx) => {
        if (cellUtils.isEmptyCell(cell) || cell.color !== sourceColor) {
          return null;
        }
        return cellUtils.createCellKey(rowIdx, columnIdx);
      })
    )
    .filter((cellKey): cellKey is CellKey => cellKey !== null);
};