import { calculateScore, type GameState, type GameStatus, type SameGame, type ScoreCard } from '@game';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useGameState(game: SameGame) {
    const [board, setBoard] = useState(game.board);
    const [gameState, setGameState] = useState<GameStatus>('NOT-STARTED');
    const [scoreCard, setScoreCard] = useState<Partial<ScoreCard>>({});
    const [movesLeft, setMovesLeft] = useState(game.movesLeft);
    
    const score = useMemo(() => calculateScore(scoreCard), [scoreCard]);

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
      score,
      scoreCard,
    }
}