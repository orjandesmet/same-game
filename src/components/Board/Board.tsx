import type { Board } from '@game/board';
import { cellUtils } from '@game/cells';
import { creatureUtils, type Color } from '@game/creatures';
import { clsx } from 'clsx';
import type { CSSProperties, PropsWithChildren } from 'react';
import styles from './Board.module.scss';

type BoardProps = PropsWithChildren<{
  board: Board;
  onCellClick: (rowIdx: number, columnIdx: number) => void;
  isGameOver: boolean;
}>;

export function Board({
  board,
  onCellClick,
  isGameOver,
  children,
}: BoardProps) {
  if (board.length === 0 || board[0].length === 0) {
    return <div className="board empty-board">No board to display</div>;
  }

  const boardStyles = {
    '--i-nr-of-columns': board.length,
    '--i-nr-of-rows': board[0].length,
  } as CSSProperties;

  return (
    <div className={styles['board-container']}>
      <div className={styles.board} style={boardStyles}>
        {board.map((column, columnIdx) =>
          column.map((cell, rowIdx) => {
            const cellStyles = {
              '--i-row-idx': rowIdx,
              '--i-column-idx': columnIdx,
            } as CSSProperties;
            if (cellUtils.isEmptyCell(cell)) {
              return (
                <div
                  key={cell.key}
                  className={clsx(styles.cell, styles.empty)}
                  style={cellStyles}
                ></div>
              );
            }
            const classNames = clsx(
              styles.cell,
              cell.hasCreature && styles['with-creature'],
              cell.hasSpecialCreature && styles.m,
              styles[cell.color.toLowerCase()],
              styles[
                `${cell.color.toLowerCase()}-${creatureUtils.getEvolutionIdx(cell.color as Color, cell.level)}`
              ],
              cell.cellState === 'BURNING' && styles.burning,
              cell.cellState === 'FLOODED' && styles.flooded,
              cell.cellState === 'CUTTING' && styles.cutting,
              cell.cellState === 'SHOCKED' && styles.shocked,
              cell.cellState === 'TRANSFORMING' && styles.transforming,
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
      </div>
      {isGameOver ? (
        <div className={styles['game-over-dialog']}>{children}</div>
      ) : null}
    </div>
  );
}
