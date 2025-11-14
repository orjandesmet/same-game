import { cellUtils } from '../cells';
import type { EffectGroupFn } from './types';

export const getCuttingGroup = (cellHasSpecialCreature: boolean): EffectGroupFn => (board, { rowIdx: sourceRowIdx }, _debug) => {
  const rows = getRows(board[0].length, sourceRowIdx, cellHasSpecialCreature, _debug);
  return board
    .flatMap((column, columnIdx) => {
      return rows.map((rowIdx) => {
        if (cellUtils.isEmptyCell(column[rowIdx])) {
          return null;
        }
        return cellUtils.createCellKey(rowIdx, columnIdx);
      })
    })
    .filter(cellUtils.isValidKey);
};

function getRows(nrOfRows: number, rowIdx: number, cellHasSpecialCreature: boolean, _debug: DebugFn): number[] {
  const rows = [rowIdx];
  if (!cellHasSpecialCreature) {
    return rows;
  }
  if (rowIdx > 0) {
  rows.push(rowIdx - 1);
  } else {
    rows.push(rowIdx + 2);
  }
  
  if (rowIdx < nrOfRows - 1) {
    rows.push(rowIdx + 1);
  } else {
    rows.push(rowIdx - 2);
  }
  _debug('VINE WHIP on idx %s of board with %s rows will affect these columns', rowIdx, nrOfRows, rows);
  return rows;
}