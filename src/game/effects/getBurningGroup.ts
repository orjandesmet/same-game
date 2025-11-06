import { cellUtils, type CellKey } from '../cells';
import type { EffectGroupFn } from './types';

export const getBurningGroup =
  (cellHasM: boolean): EffectGroupFn =>
  (board, { rowIdx: sourceRowIdx, columnIdx: sourceColumnIdx }) => {
    return board
      .flatMap((column, columnIdx) =>
        column.map((cell, rowIdx) => {
          if (
            cellUtils.isEmptyCell(cell) ||
            !cellUtils.isNearSource(
              rowIdx,
              columnIdx,
              sourceRowIdx,
              sourceColumnIdx,
              cellHasM ? 4 : 2
            )
          ) {
            return null;
          }
          return cellUtils.createCellKey(rowIdx, columnIdx);
        })
      )
      .filter((cellKey): cellKey is CellKey => cellKey !== null);
  };
