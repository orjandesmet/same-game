import { ALL_CLEARED_BONUS, type ScoreCard } from '@game';

import { CREATURE_NAMES, type CreatureScore, creatureUtils } from '@game/creatures';
import styles from './GameOverScreen.module.css';

type GameOverProps = {
  onRestartClick: () => void;
  creatureScores: CreatureScore[];
  score: number;
  scoreCard: Partial<ScoreCard>;
}

export function GameOverScreen({onRestartClick, creatureScores, score, scoreCard}: GameOverProps) {
  return (<>
  <h2>BLACKED OUT</h2>
        <span>Cells removed: {scoreCard.cellsRemoved ?? 0}</span>
        {scoreCard.multiplier && scoreCard.multiplier !== 1 && <span>Multiplier: x{scoreCard.multiplier ?? 1}</span>}
        {!!scoreCard.creatures?.length && (<>
          <span>POKéMON used:</span>
          {creatureScores.map(({color, level, score}) => (<span key={color}>{CREATURE_NAMES[color][creatureUtils.getEvolutionIdx(color, level)]}: {score}</span>))}
        </>)}
        {scoreCard.allCleared && <span>All cleared bonus: {ALL_CLEARED_BONUS}</span>}
        <hr />
        <span>Final score: {score}</span>
        <button className={styles.restartButton} type="button" onClick={onRestartClick}>START NEW GAME</button>
  </>);
}