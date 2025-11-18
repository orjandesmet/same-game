import { ALL_CLEARED_BONUS, type ScoreCard } from '@game';

import {
  CREATURE_NAMES,
  type CreatureScore,
  creatureUtils,
} from '@game/creatures';
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
      {!!scoreCard.creatures?.length && (
        <>
          <span>POKéMON used:</span>
          <ul className={styles['creature-list']}>
            {creatureScores.map(({ color, level, score }) => {
              const evolutionIdx = creatureUtils.getEvolutionIdx(color, level);

              return (
                <li className={styles['creature-list-item']} key={color}>
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
      {scoreCard.allCleared && (
        <span>All cleared bonus: ${ALL_CLEARED_BONUS}</span>
      )}
      <hr />
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
