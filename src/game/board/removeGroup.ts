import { EMPTY } from '@game/creatures';
import { cellUtils } from '../cells';
import { isEmptyColumn } from './isEmptyColumn';
import type { Board, Group } from './types';
import { updateCellsInBoard } from './updateCellsInBoard';

export function removeGroup(board: Board, group: Group): Board {
  const updatedBoard = updateCellsInBoard(board, group, {
    color: EMPTY,
    hasCreature: false,
    cellState: 'NORMAL',
  });
  const clearedBoard = updatedBoard.map((column) => {
    return [
      ...column.filter((cell) => cellUtils.isEmptyCell(cell)),
      ...column.filter((cell) => !cellUtils.isEmptyCell(cell)),
    ];
  });

  return [
    ...clearedBoard.filter((column) => !isEmptyColumn(column)),
    ...clearedBoard.filter((column) => isEmptyColumn(column)),
  ];
}
