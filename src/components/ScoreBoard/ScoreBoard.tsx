import { SeedIcon } from '@components/SeedIcon';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import styles from './ScoreBoard.module.css';

type ScoreBoardProps = PropsWithChildren<{
  score: number;
  movesLeft: number;
  seed: number;
}>;

export function ScoreBoard(props: ScoreBoardProps) {
  return (
    <div className={styles['score-board']}>
      <div className={clsx(styles['score-board-data'], styles.score)}>
        Score:&nbsp;
        <span className={styles['score-board-value']}>${props.score}</span>
      </div>
      <div className={clsx(styles['score-board-data'], styles.moves)}>
        Moves left:&nbsp;
        <span className={styles['score-board-value']}>{props.movesLeft}</span>
      </div>
      <div className={styles['score-board-info']}>
        <div className={styles['score-board-info-item']}>
          <SeedIcon />
          <span className={styles['score-board-value']}>{props.seed}</span>
        </div>
        {props.children}
      </div>
      <span className={styles['app-version']}>v{__APP_VERSION__}</span>
    </div>
  );
}
