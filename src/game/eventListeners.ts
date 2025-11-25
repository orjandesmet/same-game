import type { CellKey } from './cells';
import type {
  EventName,
  GameState,
  ScoreCard,
  StartGameParameters,
} from './types';

export type EventData<E extends EventName> = E extends 'STATE-CHANGE'
  ? GameState
  : E extends 'START-GAME'
    ? StartGameParameters
    : E extends 'GAME-OVER'
      ? Readonly<ScoreCard>
      : E extends 'MOVE-ADDED'
        ? CellKey
        : never;

export type EventListener<E extends EventName> = (data: EventData<E>) => void;

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
