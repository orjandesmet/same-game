import { BoardCell } from '@components/BoardCell';
import type { Board } from '@game/board';
import type { CellKey } from '@game/cells';
import type { CSSProperties } from 'react';

import clsx from 'clsx';
import styles from './Move.module.scss';

type MoveProps = {
  board: Board;
  cellKey: CellKey;
  className?: string;
};
export function Move({ board, cellKey, className }: MoveProps) {
  const [rowIdx, columnIdx] = cellKey.split(':').map(Number);
  const cell = board[columnIdx][rowIdx];

  const style = {
    '--cell-size-with-gap': '1.5em',
  } as CSSProperties;

  return (
    <span className={clsx(styles.move, className)}>
      <span>Next move:</span>
      <BoardCell cell={cell} style={style} />
      <span className={styles['move-description']}>
        <span>
          <span className={styles['move-description-full-text']}>at&nbsp;</span>
          row: {rowIdx + 1}
          <span className={styles['move-description-full-text']}>,&nbsp;</span>
        </span>
        <span>column: {columnIdx + 1}</span>
      </span>
    </span>
  );
}
