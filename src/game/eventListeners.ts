import type { CellKey } from './cells';
import type {
  EventName,
  GameState,
  ScoreCard,
  StartGameParameters,
} from './types';

type StateEventListener = (data: GameState) => void;
type StartGameEventListener = (parameters: StartGameParameters) => void;
type AddMoveEventListener = (move: CellKey) => void;
type GameOverListener = (scoreCard: Readonly<ScoreCard>) => void;

export type EventListener<E extends string> = E extends 'STATE-CHANGE'
  ? StateEventListener
  : E extends 'START-GAME'
    ? StartGameEventListener
    : E extends 'GAME-OVER'
      ? GameOverListener
      : E extends 'MOVE-ADDED'
        ? AddMoveEventListener
        : never;

export type EventListeners = {
  [K in EventName]: EventListener<K>[];
};

export function cleanEventListeners(): EventListeners {
  return {
    'STATE-CHANGE': [],
    'START-GAME': [],
    'GAME-OVER': [],
    'MOVE-ADDED': [],
  };
}
