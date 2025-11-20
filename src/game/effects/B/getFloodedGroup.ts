import { cellUtils } from '@game/cells';
import type { EffectGroupFn } from '../types';

export const getFloodedGroup =
  (cellHasSpecialCreature: boolean): EffectGroupFn =>
  (board, { columnIdx: sourceColumnIdx }, _debug) => {
    const columns = getColumns(
      board.length,
      sourceColumnIdx,
      cellHasSpecialCreature,
      _debug
    );
    return columns.flatMap((columnIdx) =>
      board[columnIdx]
        .map((cell, rowIdx) => {
          if (cellUtils.isEmptyCell(cell)) {
            return null;
          }
          return cellUtils.createCellKey(rowIdx, columnIdx);
        })
        .filter(cellUtils.isValidKey)
    );
  };

function getColumns(
  nrOfColumns: number,
  columnIdx: number,
  cellHasSpecialCreature: boolean,
  _debug: DebugFn
): number[] {
  const columns = [columnIdx];
  if (!cellHasSpecialCreature) {
    return columns;
  }
  if (columnIdx > 0) {
    columns.push(columnIdx - 1);
  } else {
    columns.push(columnIdx + 2);
  }

  if (columnIdx < nrOfColumns - 1) {
    columns.push(columnIdx + 1);
  } else {
    columns.push(columnIdx - 2);
  }
  _debug(
    'WATER GUN on idx %s of board with %s columns will affect these columns',
    columnIdx,
    nrOfColumns,
    columns
  );
  return columns;
}
