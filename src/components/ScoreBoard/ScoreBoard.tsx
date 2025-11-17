import clsx from 'clsx';
import styles from './ScoreBoard.module.css';

type ScoreBoardProps = {
  score: number;
  movesLeft: number;
  seed: number;
};

export function ScoreBoard(props: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoard}>
      <div className={clsx(styles.scoreBoardData, styles.score)}>
        Score: <span className={styles.scoreBoardValue}>{props.score}</span>
      </div>
      <div className={styles.scoreBoardData}>
        Moves left:{' '}
        <span className={styles.scoreBoardValue}>{props.movesLeft}</span>
      </div>
      <div className={styles.scoreBoardInfo}>
        <div className={styles.scoreBoardInfoItem}>
          <span>🌱</span>
          <span className={styles.scoreBoardValue}>{props.seed}</span>
        </div>
      </div>
    </div>
  );
}
