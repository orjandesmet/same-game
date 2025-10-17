import { EMPTY, type Cell, type CellKey } from './types';

function isEmptyCell(cell: Cell): boolean {
  return cell.value === EMPTY;
}

function isEmptyColumn(column: Cell[]) {
  return column.every(isEmptyCell);
}

function createCellKey(rowIdx: number, columnIdx: number): CellKey {
    return `${rowIdx}:${columnIdx}`
  }

export const cellUtils = {
  isEmptyCell,
  isEmptyColumn,
  createCellKey,
}