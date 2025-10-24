import { cellUtils, type CellKey } from '../cells';
import type { EffectGroupFn } from './types';

export const getCuttingGroup: EffectGroupFn = (board, { rowIdx: sourceRowIdx }) => {
  return board
    .map((column, columnIdx) => {
      if (cellUtils.isEmptyCell(column[sourceRowIdx])) {
        return null;
      }
      return cellUtils.createCellKey(sourceRowIdx, columnIdx);
    })
    .filter((cellKey): cellKey is CellKey => cellKey !== null);
};