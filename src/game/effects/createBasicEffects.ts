import type { Color } from '@game/pkmn';
import type { CellState } from '../cells';
import { EFFECT_DURATION_MS } from './constants';
import type { EffectGroupFn, Effects } from './types';

export function createBasicEffects(
  groupFn: EffectGroupFn,
  color: Color,
  effectName: Readonly<string>,
  cellState: CellState,
  level: number = 1,
  durationInMs: Readonly<number> = EFFECT_DURATION_MS,
): Effects {
  return {
    groupFn,
    stages: [
      {
        color,
        level,
        effectName,
        fn: (board, group, { cellUpdate }) =>
          cellUpdate(board, group, { cellState, hasPkmn: false }),
        duration: durationInMs,
      },
      {
        color,
        level,
        fn: (board, group, { cellRemove }) => cellRemove(board, group),
        duration: 0,
      },
    ],
  };
}