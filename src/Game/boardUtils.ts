import type { PRNG } from './rng/PRNG';
import { EMPTY, type Board, type CellKey, type CellValue, type FlatBoard } from './types';
import { cellUtils } from './cellUtils';

function createBoard(rows: number, columns: number, colors: CellValue[], rng: PRNG): Board {
  return Array.from({ length: columns })
    .map((_, columnIdx) => Array.from({ length: rows })
      .map((_, rowIdx) => ({
        key: cellUtils.createCellKey(rowIdx, columnIdx),
        value: colors[rng.nextRange(0, colors.length)]
      })
      ));
}

function toString(board: Board): string {
  const flippedBoard = Array.from({ length: board[0].length })
    .map((_, rowIdx) => Array.from(({ length: board.length }))
      .map((_, columnIdx) => board[columnIdx][rowIdx]));
  return flippedBoard.map((column) => column.map((cell) => cell.value).join('|')).join('\n');

}

function getGroup(board: Board, rowIdx: number, columnIdx: number, color: CellValue, visited: CellKey[] = []): CellKey[] {
  const groupKey = cellUtils.createCellKey(rowIdx, columnIdx);
  if (visited.includes(groupKey)) {
    return [];
  }
  if (rowIdx >= board[0].length || rowIdx < 0 || columnIdx >= board.length || columnIdx < 0) {
    return [];
  }
  if (board[columnIdx][rowIdx].value !== color) {
    return [];
  }
  visited.push(groupKey);
  const group = [groupKey]
    .concat(getGroup(board, rowIdx + 1, columnIdx, color, visited))
    .concat(getGroup(board, rowIdx - 1, columnIdx, color, visited))
    .concat(getGroup(board, rowIdx, columnIdx + 1, color, visited))
    .concat(getGroup(board, rowIdx, columnIdx - 1, color, visited))
    ;

  return group;
}

function flattenBoard(board: Board): FlatBoard {
  return board.flatMap((column, columnIdx) => column.map((cell, rowIdx) => ({ ...cell, rowIdx, columnIdx })));
}

function removeGroup(board: Board, group: CellKey[]) {
  const clearedBoard = board
    .map((column, columnIdx) => column.map((cell, rowIdx) => group.includes(cellUtils.createCellKey(rowIdx, columnIdx)) ? ({ ...cell, value: EMPTY }) : cell))
    .map((column) => {
      return [
        ...column.filter((cell) => cellUtils.isEmptyCell(cell)),
        ...column.filter((cell) => !cellUtils.isEmptyCell(cell)),
      ];
    });
  return [
    ...clearedBoard.filter((column) => !cellUtils.isEmptyColumn(column)),
    ...clearedBoard.filter((column) => cellUtils.isEmptyColumn(column)),
  ];
}


export const boardUtils = {
  createBoard,
  toString,
  flattenBoard,
  getGroup,
  getAllGroups: (board: Board): CellKey[][] => {
    return flattenBoard(board).filter((cell) => !cellUtils.isEmptyCell(cell)).reduce<CellKey[][]>((all, cell) => {
      const visited = all.flat();
      const groupForCell = getGroup(board, cell.rowIdx, cell.columnIdx, cell.value, visited);
      return [...all, groupForCell];
    }, []);
  },
  removeGroup
}