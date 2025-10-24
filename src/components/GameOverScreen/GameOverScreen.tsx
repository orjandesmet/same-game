import { ALL_CLEARED_BONUS, calculatePkmnScores, PKMN_NAMES, type ScoreCard } from '@game';
import { useMemo } from 'react';

import './GameOverScreen.css';

type GameOverProps = {
  onRestartClick: () => void;
  score: number;
  scoreCard: Partial<ScoreCard>;
}

export function GameOverScreen({onRestartClick, score, scoreCard}: GameOverProps) {
  const pkmnScores = useMemo(() => calculatePkmnScores(scoreCard.pkmn ?? []), [scoreCard]);

  return (<>
  <h2>BLACKED OUT</h2>
        <span>Cells removed: {scoreCard.cellsRemoved ?? 0}</span>
        {scoreCard.multiplier && scoreCard.multiplier !== 1 && <span>Multiplier: x{scoreCard.multiplier ?? 1}</span>}
        {!!scoreCard.pkmn?.length && (<>
          <span>POKéMON used:</span>
          {pkmnScores.map(({color, score}) => (<span>{PKMN_NAMES[color]}: {score}</span>))}
        </>)}
        {scoreCard.allCleared && <span>All cleared bonus: {ALL_CLEARED_BONUS}</span>}
        <hr />
        <span>Final score: {score}</span>
        <button className="restart-button" type="button" onClick={onRestartClick}>START NEW GAME</button>
  </>);
}