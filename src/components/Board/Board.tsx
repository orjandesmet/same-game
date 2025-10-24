import { clsx } from 'clsx';

;import type { CSSProperties, PropsWithChildren } from 'react';
import './Board.css';
import { cellUtils } from '@game/cells';
import type { Board } from '@game/board';

type BoardProps = PropsWithChildren<{
  board: Board;
  onCellClick: (rowIdx: number, columnIdx: number) => void;
  isGameOver: boolean;
}>;

export function Board({ board, onCellClick, isGameOver, children }: BoardProps) {
  if (board.length === 0 || board[0].length === 0) {
    return <div className="board empty-board">No board to display</div>;
  }

  const boardStyles = {
    '--i-nr-of-columns': board.length,
    '--i-nr-of-rows': board[0].length,
  } as CSSProperties;

  return (
    <div className="board" style={boardStyles}>
      {board.map((column, columnIdx) =>
        column.map((cell, rowIdx) => {
          const cellStyles = {
            '--i-row-idx': rowIdx,
            '--i-column-idx': columnIdx,
          } as CSSProperties;
          if (cellUtils.isEmptyCell(cell)) {
            return <div key={cell.key}
            className='cell empty'
              style={cellStyles}
              ></div>
          }
          const classNames = clsx(
            'cell',
            cell.color.toLowerCase(),
            cell.hasPkmn && 'with-pkmn',
            cell.cellState === 'BURNING' && 'is-burning',
            cell.cellState === 'FLOODED' && 'is-flooded',
            cell.cellState === 'CUTTING' && 'is-cutting',
            cell.cellState === 'SHOCKED' && 'is-shocked',
            cell.cellState === 'TRANSFORMING' && 'is-transforming'
          );
          return (
            <button
              key={cell.key}
              type="button"
              className={classNames}
              style={cellStyles}
              onClick={() => onCellClick(rowIdx, columnIdx)}
            ></button>
          );
        })
      )}
      {isGameOver ? (<div className="game-over-dialog">
        {children}
      </div>) : null}
    </div>
  );
}
