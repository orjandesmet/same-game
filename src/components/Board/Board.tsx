import type { Board } from '@game/board';
import { cellUtils } from '@game/cells';
import { pkmnUtils, type Color } from '@game/pkmn';
import { clsx } from 'clsx';
import type { CSSProperties, PropsWithChildren } from 'react';
import styles from './Board.module.scss';

;
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
    <div className={styles.board} style={boardStyles}>
      {board.map((column, columnIdx) =>
        column.map((cell, rowIdx) => {
          const cellStyles = {
            '--i-row-idx': rowIdx,
            '--i-column-idx': columnIdx,
          } as CSSProperties;
          if (cellUtils.isEmptyCell(cell)) {
            return <div key={cell.key}
            className={clsx(styles.cell, styles.empty)}
              style={cellStyles}
              ></div>
          }
          const classNames = clsx(
            styles.cell,
            styles[cell.color.toLowerCase()],
            cell.hasPkmn && styles.withPkmn,
            styles[`${cell.color.toLowerCase()}-${pkmnUtils.getEvolutionIdx(cell.color as Color, cell.level)}`],
            cell.cellState === 'BURNING' && styles.isBurning,
            cell.cellState === 'FLOODED' && styles.isFlooded,
            cell.cellState === 'CUTTING' && styles.isCutting,
            cell.cellState === 'SHOCKED' && styles.isShocked,
            cell.cellState === 'TRANSFORMING' && styles.isTransforming
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
      {isGameOver ? (<div className={styles.gameOverDialog}>
        {children}
      </div>) : null}
    </div>
  );
}
