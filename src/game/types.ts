import type { Board } from './board';
import type { ExtendedColor } from './pkmn';

export const ALL_CLEARED_BONUS = 1000;

export type GameStatus = Readonly<
  'NOT-STARTED' | 'IN-PROGRESS' | 'PAUSED' | 'GAME-OVER'
>;
export type ScoreCard = {
  allCleared: boolean;
    cellsRemoved: number;
    multiplier: number;
    pkmn: ExtendedColor[],
  };
export type GameState = Readonly<{
  board: Board;
  movesLeft: number;
  scoreCard: Readonly<ScoreCard>;
  gameState: GameStatus;
}>;
