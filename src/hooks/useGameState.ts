import {
  calculateScore,
  type GameState,
  type GameStatus,
  type SameGame,
  type ScoreCard,
} from '@game';
import { creatureUtils, type PartyMembers } from '@game/creatures';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useGameState(
  game: SameGame,
  partyMembers: Partial<PartyMembers>
) {
  const [board, setBoard] = useState(game.board);
  const [gameState, setGameState] = useState<GameStatus>('NOT-STARTED');
  const [scoreCard, setScoreCard] = useState<Partial<ScoreCard>>({});
  const [movesLeft, setMovesLeft] = useState(game.movesLeft);

  const score = useMemo(
    () => calculateScore(scoreCard, partyMembers),
    [scoreCard, partyMembers]
  );
  const creatureScores = useMemo(
    () =>
      creatureUtils.calculateCreatureScores(
        scoreCard.creatures ?? [],
        partyMembers
      ),
    [scoreCard, partyMembers]
  );

  const handleStateChange = useCallback((gameState: GameState) => {
    setBoard(gameState.board);
    setMovesLeft(gameState.movesLeft);
    setScoreCard(gameState.scoreCard);
    setGameState(gameState.gameState);
  }, []);

  useEffect(() => {
    game.addStateChangeListener(handleStateChange);

    return () => {
      game.removeStateChangeListener(handleStateChange);
    };
  }, [game, handleStateChange]);

  return {
    board,
    gameState,
    movesLeft,
    creatureScores,
    score,
    scoreCard,
  };
}
