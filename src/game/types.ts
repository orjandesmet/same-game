import type { Board } from './board';
import type { ExtendedColor, PartyMembers } from './creatures';

export const ALL_CLEARED_BONUS = 1000;

export type GameStatus = Readonly<
  'NOT-STARTED' | 'IN-PROGRESS' | 'PAUSED' | 'GAME-OVER'
>;
export type ScoreCard = {
  allCleared: boolean;
  cellsRemoved: number;
  multiplier: number;
  creatures: ExtendedColor[];
};

export type GameState = Readonly<{
  board: Board;
  movesLeft: number;
  scoreCard: Readonly<ScoreCard>;
  gameState: GameStatus;
}>;

export type StartGameParameters = {
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: PartyMembers;
  seed: number;
};

export type EventName =
  | 'STATE-CHANGE'
  | 'START-GAME'
  | 'GAME-OVER'
  | 'MOVE-ADDED';
