import type { Cell } from '../cells';
import type { Board, Group } from './types';

export function updateCellsInBoard(
  board: Board,
  group: Group,
  updatedCell: Partial<Pick<Cell, 'color' | 'hasPkmn' | 'cellState'>>
): Board {
  const newBoard = structuredClone(board);
  group.forEach((cellKey) => {
    const [rowIdx, columnIdx] = cellKey.split(':').map(Number);
    Object.assign(newBoard[columnIdx][rowIdx], updatedCell);
  });

  return newBoard;
}