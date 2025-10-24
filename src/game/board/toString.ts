import type { CellColor } from '../cells';
import type { Board } from './types';

// TODO: add indexes
export function toString(board: Board): Readonly<string | string[]> {
  const flippedBoard: CellColor[][] = Array.from({ length: board[0].length }).map(
    (_, rowIdx) => Array.from({ length: board.length }).map(
        (_, columnIdx) => board[columnIdx][rowIdx].color
      )
  );
  const withIndexes = Array.from({length: board[0].length + 1}).map((_, rowIdx) => rowIdx === 0 ? '' : `${rowIdx - 1}`);
  return [withIndexes].concat(flippedBoard)
      .map((column, rowIdx) => (rowIdx === 0 ? column : [`${rowIdx - 1}`].concat(column)).join('|'))
      .join('\n');
}