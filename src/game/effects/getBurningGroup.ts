import { boardUtils } from '../board';
import { cellUtils, type CellKey } from '../cells';
import type { EffectGroupFn } from './types';

export const getBurningGroup: EffectGroupFn = (
  board,
  { rowIdx: sourceRowIdx, columnIdx: sourceColumnIdx }
) => {
  return board
    .flatMap((column, columnIdx) =>
      column.map((cell, rowIdx) => {
        if (
          cellUtils.isEmptyCell(cell) ||
          !boardUtils.isNearSource(
            rowIdx,
            columnIdx,
            sourceRowIdx,
            sourceColumnIdx,
            2
          )
        ) {
          return null;
        }
        return cellUtils.createCellKey(rowIdx, columnIdx);
      })
    )
    .filter((cellKey): cellKey is CellKey => cellKey !== null);
};