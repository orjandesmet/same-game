import { cellUtils, type CellColor } from '../cells';
import type { Board, ColumnIdx, Group, RowIdx } from './types';

export function getGroup(
  board: Board,
  rowIdx: RowIdx,
  columnIdx: ColumnIdx,
  color: CellColor,
  visited: string[] = []
): Group {
  const groupKey = cellUtils.createCellKey(rowIdx, columnIdx);
  if (visited.includes(groupKey)) {
    return [];
  }
  if (
    rowIdx >= board[0].length ||
    rowIdx < 0 ||
    columnIdx >= board.length ||
    columnIdx < 0
  ) {
    return [];
  }
  if (board[columnIdx][rowIdx].color !== color) {
    return [];
  }
  visited.push(groupKey);
  const group = [groupKey]
    .concat(getGroup(board, rowIdx + 1, columnIdx, color, visited))
    .concat(getGroup(board, rowIdx - 1, columnIdx, color, visited))
    .concat(getGroup(board, rowIdx, columnIdx + 1, color, visited))
    .concat(getGroup(board, rowIdx, columnIdx - 1, color, visited));
  return group;
}