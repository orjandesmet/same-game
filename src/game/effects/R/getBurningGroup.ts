import { cellUtils } from '@game/cells';
import type { EffectGroupFn } from '../types';

export const getBurningGroup =
  (cellHasSpecialCreature: boolean): EffectGroupFn =>
  (board, { rowIdx: sourceRowIdx, columnIdx: sourceColumnIdx }, _debug) => {
    if (cellHasSpecialCreature) {
      _debug('EMBER burns brighter than ever');
    }
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
              cellHasSpecialCreature ? 4 : 2
            )
          ) {
            return null;
          }
          return cellUtils.createCellKey(rowIdx, columnIdx);
        })
      )
      .filter(cellUtils.isValidKey);
  };
