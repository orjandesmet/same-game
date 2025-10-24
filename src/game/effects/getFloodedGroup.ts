import { cellUtils, type CellKey } from '../cells';
import type { EffectGroupFn } from './types';


export const getFloodedGroup: EffectGroupFn = (
  board,
  { columnIdx: sourceColumnIdx }
) => {
  return board[sourceColumnIdx]
    .map((cell, rowIdx) => {
      if (cellUtils.isEmptyCell(cell)) {
        return null;
      }
      return cellUtils.createCellKey(rowIdx, sourceColumnIdx);
    })
    .filter((cellKey): cellKey is CellKey => cellKey !== null);
};