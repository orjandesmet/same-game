import { BoardCell } from '@components/BoardCell';
import type { Board } from '@game/board';
import type { CSSProperties, PropsWithChildren } from 'react';
import styles from './Board.module.scss';

type BoardProps = PropsWithChildren<{
  board: Board;
  onCellClick: (rowIdx: number, columnIdx: number) => void;
  isGameOver: boolean;
  isDisabled: boolean;
  hideColors: boolean;
}>;

export function Board({
  board,
  onCellClick,
  isDisabled,
  isGameOver,
  hideColors,
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
            return (
              <BoardCell
                as="button"
                key={cell.key}
                cell={cell}
                style={cellStyles}
                onCellClick={() => onCellClick(rowIdx, columnIdx)}
                isDisabled={isDisabled}
                isColorHidden={hideColors}
              />
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
