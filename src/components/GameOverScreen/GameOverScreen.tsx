import { ALL_CLEARED_BONUS, type ScoreCard } from '@game';

import { PKMN_NAMES, pkmnUtils, type PkmnScore } from '@game/pkmn';
import styles from './GameOverScreen.module.css';

type GameOverProps = {
  onRestartClick: () => void;
  pkmnScores: PkmnScore[];
  score: number;
  scoreCard: Partial<ScoreCard>;
}

export function GameOverScreen({onRestartClick, pkmnScores, score, scoreCard}: GameOverProps) {
  return (<>
  <h2>BLACKED OUT</h2>
        <span>Cells removed: {scoreCard.cellsRemoved ?? 0}</span>
        {scoreCard.multiplier && scoreCard.multiplier !== 1 && <span>Multiplier: x{scoreCard.multiplier ?? 1}</span>}
        {!!scoreCard.pkmn?.length && (<>
          <span>POKéMON used:</span>
          {pkmnScores.map(({color, level, score}) => (<span key={color}>{PKMN_NAMES[color][pkmnUtils.getEvolutionIdx(color, level)]}: {score}</span>))}
        </>)}
        {scoreCard.allCleared && <span>All cleared bonus: {ALL_CLEARED_BONUS}</span>}
        <hr />
        <span>Final score: {score}</span>
        <button className={styles.restartButton} type="button" onClick={onRestartClick}>START NEW GAME</button>
  </>);
}