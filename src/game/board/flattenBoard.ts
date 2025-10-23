import type { Board, FlatBoard } from './types';

export function flattenBoard(board: Board): FlatBoard {
  return board.flatMap((column, columnIdx) =>
    column.map((cell, rowIdx) => ({ ...cell, rowIdx, columnIdx }))
  );
}