import { ALL_CLEARED_BONUS, type ScoreCard } from '@game';

import {
  CREATURE_NAMES,
  type CreatureScore,
  creatureUtils,
} from '@game/creatures';
import clsx from 'clsx';
import styles from './GameOverScreen.module.css';

type GameOverProps = {
  onRestartClick: () => void;
  creatureScores: CreatureScore[];
  score: number;
  scoreCard: Partial<ScoreCard>;
};

export function GameOverScreen({
  onRestartClick,
  creatureScores,
  score,
  scoreCard,
}: GameOverProps) {
  return (
    <>
      <h2>GAME OVER</h2>
      <span>Cells removed: ${scoreCard.cellsRemoved ?? 0}</span>
      {scoreCard.multiplier && scoreCard.multiplier !== 1 && (
        <span>Multiplier: x{scoreCard.multiplier ?? 1}</span>
      )}
      <hr className={styles.hr} />
      {!!scoreCard.creatures?.length && (
        <>
          <span>Bonuses:</span>
          <ul className={styles['creature-list']}>
            {creatureScores.map(({ color, level, score }) => {
              const evolutionIdx = creatureUtils.getEvolutionIdx(color, level);

              return (
                <li
                  className={clsx(
                    styles['creature-list-item'],
                    styles[color.toLowerCase()]
                  )}
                  key={color}
                >
                  <img
                    className={styles['creature-list-image']}
                    src={`/creatures/sprites/${color}-${evolutionIdx}.png`}
                    alt={CREATURE_NAMES[color][evolutionIdx]}
                  />
                  ${score}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {scoreCard.allCleared && <span>All cleared: ${ALL_CLEARED_BONUS}</span>}
      <hr className={styles.hr} />
      <span>Final score: ${score}</span>
      <button
        className={styles['restart-button']}
        type="button"
        onClick={onRestartClick}
      >
        START NEW GAME
      </button>
    </>
  );
}
