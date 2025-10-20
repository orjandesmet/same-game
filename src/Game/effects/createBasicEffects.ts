import type { CellState } from '../cells';
import { EFFECT_DURATION_MS } from './constants';
import type { EffectGroupFn, Effects } from './types';

export function createBasicEffects(
  groupFn: EffectGroupFn,
  effectName: Readonly<string>,
  cellState: CellState,
  durationInMs: Readonly<number> = EFFECT_DURATION_MS
): Effects {
  return {
    groupFn,
    stages: [
      {
        effectName,
        fn: (board, group, { cellUpdate }) =>
          cellUpdate(board, group, { cellState, hasPkmn: false }),
        duration: durationInMs,
      },
      {
        fn: (board, group, { cellRemove }) => cellRemove(board, group),
        duration: 0,
      },
    ],
  };
}