import { cellUtils, type CellKey } from '../cells';
import type { EffectGroupFn } from './types';


export const getFloodedGroup = (cellHasM: boolean): EffectGroupFn => (
  board,
  { columnIdx: sourceColumnIdx },
  _debug
) => {
  const columns = getColumns(board.length, sourceColumnIdx, cellHasM, _debug);
  return columns
    .flatMap((columnIdx) => board[columnIdx].map((cell, rowIdx) => {
        if (cellUtils.isEmptyCell(cell)) {
          return null;
        }
        return cellUtils.createCellKey(rowIdx, columnIdx);
      })
      .filter((cellKey): cellKey is CellKey => cellKey !== null)
    )
};

function getColumns(nrOfColumns: number, columnIdx: number, cellHasM: boolean, _debug: DebugFn): number[] {
  const columns = [columnIdx];
  if (!cellHasM) {
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
  _debug('WATER GUN on idx %s of board with %s columns will affect these columns', columnIdx, nrOfColumns, columns);
  return columns;
}