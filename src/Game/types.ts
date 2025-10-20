import type { Board } from './board';
import type { CellColor } from './cells';

export const ALL_CLEARED_BONUS = 1000;

export type GameStatus = Readonly<
  'NOT-STARTED' | 'IN-PROGRESS' | 'PAUSED' | 'GAME-OVER'
>;
export type ScoreCard = {
  allCleared: boolean;
    cellsRemoved: number;
    multiplier: number;
    pkmn: CellColor[],
  };
export type GameState = Readonly<{
  board: Board;
  movesLeft: number;
  scoreCard: Readonly<ScoreCard>;
  gameState: GameStatus;
}>;
